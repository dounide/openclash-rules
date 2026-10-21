#!/usr/bin/env python3
"""Generate client rule blocks from openclash/module.conf (Python 3.10+)."""

from __future__ import annotations

import argparse
import ipaddress
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path


AUTO = "${AUTO_GROUP}"
PROXY = "${PROXY_GROUP}"
POLICIES = {AUTO, PROXY, "DIRECT", "REJECT"}
DOMAIN_TYPES = {"DOMAIN", "DOMAIN-SUFFIX", "DOMAIN-KEYWORD"}
IP_TYPES = {"IP-CIDR", "IP-CIDR6"}
TARGETS = (
    ("shadowrocket/custom-rules.sgmodule", "#", "shadowrocket"),
    ("flclash/rules.js", "  //", "javascript"),
    ("clash-party/override.js", "  //", "javascript"),
)


@dataclass(frozen=True)
class Rule:
    text: str
    enabled: bool
    comment: str


def parse_value(body: str) -> tuple[str, str]:
    """Read one quoted or plain YAML scalar and its optional line comment."""
    if body.startswith('"'):
        value, end = json.JSONDecoder().raw_decode(body)
        if not isinstance(value, str):
            raise ValueError("rule must be a string")
        tail = body[end:].strip()
    elif body.startswith("'"):
        match = re.match(r"'((?:[^']|'')*)'", body)
        if not match:
            raise ValueError("unterminated single-quoted rule")
        value = match.group(1).replace("''", "'")
        tail = body[match.end():].strip()
    else:
        value, separator, comment = body.partition("#")
        value = value.strip()
        tail = "#" + comment if separator else ""
    if tail and not tail.startswith("#"):
        raise ValueError("unexpected text after rule")
    return value, tail[1:].strip() if tail else ""


def validate_rule(value: str) -> str:
    parts = [part.strip() for part in value.split(",")]
    if len(parts) not in (3, 4):
        raise ValueError("expected TYPE,target,policy[,no-resolve]")
    kind, target, policy = parts[:3]
    if kind not in DOMAIN_TYPES | IP_TYPES:
        raise ValueError(
            f"unsupported cross-client rule type {kind!r}; "
            "use DOMAIN, DOMAIN-SUFFIX, DOMAIN-KEYWORD, IP-CIDR or IP-CIDR6"
        )
    if policy not in POLICIES:
        raise ValueError(
            f"unsupported policy {policy!r}; use "
            "${AUTO_GROUP}, ${PROXY_GROUP}, DIRECT or REJECT"
        )
    if kind in DOMAIN_TYPES:
        if not re.fullmatch(r"[\w.-]+", target, flags=re.UNICODE):
            raise ValueError(f"invalid domain/keyword {target!r}")
        if len(parts) == 4:
            raise ValueError("no-resolve is only supported on IP rules")
    else:
        if not re.fullmatch(r"[^/]+/[0-9]+", target):
            raise ValueError("IP rules require an explicit numeric prefix, such as /32 or /128")
        network = ipaddress.ip_network(target, strict=False)
        expected_version = 4 if kind == "IP-CIDR" else 6
        if network.version != expected_version:
            raise ValueError(f"{kind} requires IPv{expected_version}")
        if len(parts) == 4 and parts[3] != "no-resolve":
            raise ValueError("the only supported IP option is no-resolve")
    return ",".join(parts)


def read_rules(source: Path) -> list[Rule]:
    rows = source.read_text(encoding="utf-8-sig").splitlines()
    yaml_section = False
    reading_rules = False
    found_block = False
    rules: list[Rule] = []
    for number, line in enumerate(rows, 1):
        stripped = line.strip()
        if stripped.startswith("[") and stripped.endswith("]"):
            if reading_rules:
                break
            yaml_section = stripped == "[YAML]"
            continue
        if not yaml_section:
            continue
        if re.fullmatch(r"\+rules:\s*(?:#.*)?", line):
            if found_block:
                raise ValueError("duplicate +rules block")
            found_block = reading_rules = True
            continue
        if not reading_rules:
            continue
        if not stripped:
            continue
        match = re.fullmatch(r"\s*(#\s*)?-\s+(.+)", line)
        if not match:
            if stripped.startswith("#"):
                continue
            if line and not line[0].isspace():
                reading_rules = False
                continue
            raise ValueError(f"{source.name}:{number}: expected one rule per line")
        try:
            value, comment = parse_value(match.group(2))
            text = validate_rule(value)
        except (ValueError, json.JSONDecodeError) as error:
            raise ValueError(f"{source.name}:{number}: {error}") from error
        comment = comment.replace("\u2028", " ").replace("\u2029", " ")
        rules.append(Rule(text, not bool(match.group(1)), comment))
    if not found_block or not any(rule.enabled for rule in rules):
        raise ValueError("source must contain a nonempty [YAML] +rules block")
    return rules


def render_rules(rules: list[Rule], kind: str) -> str:
    lines = []
    for rule in rules:
        if kind == "shadowrocket":
            if rule.comment:
                lines.append("#" + rule.comment)
            text = rule.text.replace(AUTO, "{{{AUTO_GROUP}}}")
            text = text.replace(PROXY, "{{{PROXY_GROUP}}}")
            lines.append(("" if rule.enabled else "# ") + text)
        else:
            # Validated rule fields cannot contain arbitrary JavaScript.
            if AUTO in rule.text or PROXY in rule.text:
                literal = chr(96) + rule.text + chr(96)
            else:
                literal = json.dumps(rule.text, ensure_ascii=False)
            line = "  " + ("" if rule.enabled else "// ") + literal + ","
            if rule.comment:
                line += " // " + rule.comment
            lines.append(line)
    return "\n".join(lines) + "\n"


def replace_block(text: str, prefix: str, body: str) -> str:
    begin = prefix + " BEGIN GENERATED RULES"
    end = prefix + " END GENERATED RULES"
    if text.splitlines().count(begin) != 1 or text.splitlines().count(end) != 1:
        raise ValueError("expected one exact pair of generated-rule markers")
    start = text.index(begin) + len(begin)
    stop = text.index(end)
    if start >= stop:
        raise ValueError("generated-rule markers are out of order")
    return text[:start] + "\n" + body + text[stop:]


def synchronize(root: Path, check: bool = False) -> bool:
    rules = read_rules(root / "openclash/module.conf")
    outputs = []
    # Validate all files before writing any of them.
    for relative, prefix, kind in TARGETS:
        path = root / relative
        current = path.read_text(encoding="utf-8")
        updated = replace_block(current, prefix, render_rules(rules, kind))
        outputs.append((path, current, updated))
    changed = False
    for path, current, updated in outputs:
        if current == updated:
            continue
        changed = True
        if not check:
            path.write_text(updated, encoding="utf-8", newline="\n")
        print(("OUT OF DATE " if check else "UPDATED ") + str(path.relative_to(root)))
    enabled = sum(rule.enabled for rule in rules)
    print(f"Rules: {enabled} enabled, {len(rules) - enabled} disabled; 3 clients checked.")
    return not (check and changed)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--check", action="store_true", help="check without changing files")
    options = parser.parse_args()
    try:
        return 0 if synchronize(options.root.resolve(), options.check) else 1
    except (OSError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
