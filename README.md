# 多平台自定义分流规则

一份规则源，生成 OpenClash、小火箭（Shadowrocket）、FlClash 和 Clash Party 的订阅文件。各平台文件用于叠加到已有配置中，需要你已经有可用的节点和基础配置。

初始规则为 49 条启用、1 条注释禁用；保留原始类型、目标、顺序和动作对应。后续规则数量以源文件为准。

## 选择你的客户端

| 客户端 | 在线文件 | 导入位置 | 详细说明 |
| --- | --- | --- | --- |
| OpenClash | [module.conf](https://raw.githubusercontent.com/dounide/openclash-rules/main/openclash/module.conf) | 运行状态 → 覆写模块 → 订阅链接 | [OpenClash 说明](openclash/README.md) |
| 小火箭 Shadowrocket | [custom-rules.sgmodule](https://raw.githubusercontent.com/dounide/openclash-rules/main/shadowrocket/custom-rules.sgmodule) | 配置 → 模块 → ＋ | [小火箭说明](shadowrocket/README.md) |
| FlClash | [rules.js](https://raw.githubusercontent.com/dounide/openclash-rules/main/flclash/rules.js) | 配置的扩展 → 脚本 → 通过 URL 导入，再选中脚本 | [FlClash 说明](flclash/README.md) |
| Clash Party | [override.js](https://raw.githubusercontent.com/dounide/openclash-rules/main/clash-party/override.js) | 标准模式：覆写 → 导入，再在订阅管理中绑定 | [Clash Party 说明](clash-party/README.md) |

四个链接格式不同，请使用对应客户端的入口。FlClash v0.9.1 中文将原来的“覆写”称为“扩展”；Clash Party v2.0.4 使用本方案时需要“标准模式”。

## 以后只维护一份规则

统一源文件是 [openclash/module.conf](openclash/module.conf)。[点击这里在线编辑](https://github.com/dounide/openclash-rules/edit/main/openclash/module.conf)，在原有 `+rules:` 下增删规则，保持缩进，例如：

```yaml
  - "DOMAIN-SUFFIX,example.com,${PROXY_GROUP}" # 默认代理
  - "DOMAIN-SUFFIX,example.org,${AUTO_GROUP}" # 自动选择
  - "DOMAIN-SUFFIX,example.net,DIRECT" # 直连
  - "DOMAIN,ads.example.com,REJECT" # 拦截
  - "IP-CIDR,192.0.2.1/32,DIRECT,no-resolve" # IP 示例
```

以上只是写法示例，没有加入实际订阅。规则从上到下匹配；要优先处理的规则放在前面。

1. 在 GitHub 编辑源文件后，点击 **Commit changes** 提交。
2. 打开本仓库 [Actions](https://github.com/dounide/openclash-rules/actions)，等待 **Sync client rules** 成功。它会更新其余三个客户端的规则块；已有订阅地址保持不变。
3. 在对应客户端刷新模块或脚本，再按下表应用。

| 客户端 | 手动立即更新 |
| --- | --- |
| OpenClash | 覆写模块列表刷新该模块，下载成功后重启 OpenClash |
| 小火箭 | 配置 → 模块 → 更新模块，再对当前配置执行使用配置／编译配置 |
| FlClash | 脚本条目菜单 → 同步；v0.9.1 当前配置使用该脚本时会自动重新应用 |
| Clash Party | 覆写卡片 ↻；v2.0.4 会下载并重新加载已绑定的当前配置 |

GitHub Raw 有缓存，提交后偶尔需要稍等；需要核对时先打开对应在线文件查看新增规则。Actions 失败时，其余平台保留上次生成结果，修正源文件后重新运行；OpenClash 直接读取源文件，更新前也应确认规则写法正确。

源文件采用每行一条规则的写法，支持双引号、单引号或普通文本。统一生成器支持 `DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR`、`IP-CIDR6`；动作使用 `${AUTO_GROUP}`、`${PROXY_GROUP}`、`DIRECT` 或 `REJECT`。IP 规则需写 `/32`、`/128` 等数字前缀，只有 IP 规则可添加 `no-resolve`。其他类型或新变量会明确报错，需要先扩展各平台兼容处理。

## 策略组名称在哪里改

| 客户端 | 设置方法 |
| --- | --- |
| OpenClash | 模块“环境变量”分两行填 Key `AUTO_GROUP` / `PROXY_GROUP` 和各自 Value。文件中的 `# 模块参数` 只是注释。 |
| 小火箭 | 模块“编辑参数”修改 `AUTO_GROUP` / `PROXY_GROUP`。默认均为小火箭内置 `PROXY`，不会自动测速或新建分组。要自动选择，请绑定本机已有的 `url-test` 分组。 |
| FlClash | 修改 [rules.js](flclash/rules.js) 顶部的 `const AUTO_GROUP`、`const PROXY_GROUP` 两个实际值。 |
| Clash Party | 修改 [override.js](clash-party/override.js) 顶部的同名两行赋值。 |

Clash 客户端的默认组名是 `♻️ 自动选择` 和 `🚀 默认代理`，必须与实际配置完全一致，包含空格和 Emoji。脚本会提示缺少的组名，不会创建虚构节点或代理组。

自动同步只替换 `BEGIN GENERATED RULES` 和 `END GENERATED RULES` 之间的规则，保留脚本顶部策略组常量、小火箭模块默认参数及块外代码。组名更改应保存到 GitHub，然后刷新对应客户端。不要直接维护生成块，它会在下次同步时重新生成。

多人分享时，OpenClash 和小火箭可在各自设备填写参数。FlClash 和 Clash Party 的组名保存在脚本里；如果各自配置不同，可以 fork 本仓库，修改自己的组名并使用自己仓库的 Raw 链接。

## 本地同步

下载仓库后，在仓库根目录使用 Python 3.10 或更新版本运行：

```sh
python tools/sync_rules.py
python tools/sync_rules.py --check
```

前一条生成文件，后一条只检查是否同步。也可在 Actions 的 **Sync client rules → Run workflow** 手动触发同步。

## 核实与验证

2026-10-21 对照 OpenClash v0.48.002、FlClash v0.9.1、Clash Party v2.0.4 官方源码，以及小火箭模块语法和原作者示例制作。各平台 README 中列出具体来源及界面差异。

本地验证包含规则逐条对应、原顺序和禁用状态、两份 JavaScript 的 `main(config)` 执行、原配置及兜底规则保留、缺组报错、生成器增删规则和错误输入处理，以及 Mihomo 配置解析。小火箭未做 iOS 真机验证，各客户端仍需按自己的节点与策略组导入。
