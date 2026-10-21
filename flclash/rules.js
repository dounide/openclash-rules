// FlClash 远程扩展脚本，入口为 main(config)。
// 订阅：https://raw.githubusercontent.com/dounide/openclash-rules/main/flclash/rules.js
// 把下面两个值改成现有配置的实际策略组名称，空格和 Emoji 也要一致。
const AUTO_GROUP = "♻️ 自动选择";
const PROXY_GROUP = "🚀 默认代理";

// 此数组由 openclash/module.conf 自动生成，请在源文件中增删规则。
const CUSTOM_RULES = [
  // BEGIN GENERATED RULES
  `DOMAIN-SUFFIX,agentrouter.org,${AUTO_GROUP}`,
  `DOMAIN-SUFFIX,51cg.fun,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,cg51.com,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,missav.ai,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,mypikpak.com,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,yuanshen.xn--6qq986b3xl,${PROXY_GROUP}`, // WG
  `DOMAIN-SUFFIX,cc.cd,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,us.ci,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,eu.cc,${PROXY_GROUP}`,
  `DOMAIN-SUFFIX,xt-url.com,${PROXY_GROUP}`, // 小天
  `DOMAIN-SUFFIX,ghxi.com,${PROXY_GROUP}`,
  "DOMAIN-SUFFIX,hybgzs.com,DIRECT", // 黑与白
  "DOMAIN,333.333291.xyz,DIRECT", // 木偶
  "DOMAIN,666.666291.xyz,DIRECT", // 木偶
  "DOMAIN,123.666291.xyz,DIRECT", // 木偶
  "DOMAIN,www.muou.site,DIRECT", // 木偶
  "DOMAIN,muoua.top,DIRECT", // 木偶
  "DOMAIN,wogg.xxooo.cf,DIRECT", // 玩偶
  "DOMAIN,www.wogg.net,DIRECT", // 玩偶
  "DOMAIN,woggan.888484.xyz,DIRECT", // 玩偶
  "DOMAIN,www.wogg.live,DIRECT", // 玩偶
  "DOMAIN,woggan.xxooo.cf,DIRECT", // 玩偶
  `DOMAIN-SUFFIX,xiaogege.shop,${PROXY_GROUP}`, // 蜡笔
  "DOMAIN,feimo.fun,DIRECT", // 蜡笔
  `DOMAIN,sd.sduc.site,${PROXY_GROUP}`, // 闪电
  `DOMAIN,shandian.blog,${PROXY_GROUP}`, // 闪电
  `DOMAIN-SUFFIX,sduc.cloud,${PROXY_GROUP}`, // 闪电
  `DOMAIN,woog.nxog.eu.org,${PROXY_GROUP}`, // 欧哥
  `DOMAIN,woog.430520.xyz,${PROXY_GROUP}`, // 欧哥
  `DOMAIN,www.miqk.cc,${PROXY_GROUP}`, // 至臻
  "DOMAIN-SUFFIX,mihdr.top,DIRECT", // 至臻
  `DOMAIN,www.2xiaopan.top,${PROXY_GROUP}`, // 二小
  `DOMAIN,www.wexwp.cc,${PROXY_GROUP}`, // 二小
  "DOMAIN,xhban.xyz,DIRECT", // 虎斑
  "DOMAIN,xsayang.fun,DIRECT", // 多多
  // "IP-CIDR,38.76.197.172/32,DIRECT,no-resolve", // 虎斑/多多（保持禁用）
  "IP-CIDR,121.205.88.174/32,DIRECT,no-resolve", // 虎斑/多多
  `DOMAIN,tv.yydsys.top,${PROXY_GROUP}`, // 多多
  `DOMAIN,tv.yydsys.cc,${PROXY_GROUP}`, // 多多
  `DOMAIN,tv.214521.xyz,${PROXY_GROUP}`, // 多多
  `DOMAIN,yydsys.de5.net,${PROXY_GROUP}`, // 多多
  "DOMAIN,xn--4yqy17f.xn--yi7aa.vip,DIRECT", // 龙龙
  `DOMAIN,www.hjzhencai.top,${PROXY_GROUP}`, // 花卷
  `DOMAIN,pan1.me,${PROXY_GROUP}`, // 123分享社区
  `DOMAIN,www.123panfx.com,${PROXY_GROUP}`, // 123分享社区
  `DOMAIN-SUFFIX,xqjzvcvt.top,${PROXY_GROUP}`, // 黄豆
  `DOMAIN-KEYWORD,4gtvfreemobile,${PROXY_GROUP}`, // 4gTV
  "DOMAIN,www.4kcz.com,DIRECT", // 厂长
  "DOMAIN,www.cz4k.com,DIRECT", // 厂长
  "DOMAIN,czy.top,DIRECT", // 厂长
  // END GENERATED RULES
];

function main(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("FlClash 扩展需要一个配置对象。");
  }
  if (config.rules != null && !Array.isArray(config.rules)) {
    throw new Error("配置中的 rules 必须是规则数组。");
  }
  const groups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];
  const availableGroups = groups
    .map((group) => group && group.name)
    .filter((name) => typeof name === "string");
  const missingGroups = [...new Set([AUTO_GROUP, PROXY_GROUP])].filter(
    (name) => !availableGroups.includes(name)
  );
  if (missingGroups.length > 0) {
    throw new Error(
      `缺少策略组：${missingGroups.join("、")}。` +
      "请修改脚本顶部 AUTO_GROUP 和 PROXY_GROUP，名称的空格和 Emoji 也须一致。" +
      `可用策略组：${availableGroups.join("、") || "（配置中没有策略组）"}`
    );
  }
  const originalRules = config.rules || [];
  // 同一规则块重复执行时不再堆叠；原订阅规则和末尾 MATCH 保持原顺序。
  const alreadyPrepended = CUSTOM_RULES.every(
    (rule, index) => originalRules[index] === rule
  );
  config.rules = alreadyPrepended
    ? originalRules
    : CUSTOM_RULES.concat(originalRules);
  return config;
}
