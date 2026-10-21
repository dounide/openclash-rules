// Clash Party JavaScript 远程覆写（标准模式）。
// 规则来源：openclash/module.conf；保留原始顺序与禁用状态。
// 增删规则请修改该源文件；GitHub Actions 自动同步下方标记内的规则数组。
// 策略组只改下面两行；名称必须与当前订阅完全一致（包括空格和 Emoji）。
// 在 GitHub 修改后提交，再到 Clash Party 的「覆写」页点击此文件的刷新按钮。
const AUTO_GROUP = "♻️ 自动选择";
const PROXY_GROUP = "🚀 默认代理";

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
    throw new Error("[openclash-rules] 覆写输入必须是订阅配置对象。");
  }

  const groups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];
  const groupNames = groups
    .filter((group) => group && typeof group.name === "string")
    .map((group) => group.name);
  const missing = [...new Set([AUTO_GROUP, PROXY_GROUP])].filter(
    (name) => !groupNames.includes(name)
  );
  if (missing.length) {
    throw new Error(
      "[openclash-rules] 未找到策略组：" + missing.join("、") +
      "。请修改脚本顶部 AUTO_GROUP / PROXY_GROUP，与当前订阅中的名称完全一致。" +
      "当前策略组：" + (groupNames.join("、") || "（无）") +
      "。当前脚本未应用自定义规则。"
    );
  }
  if (config.rules != null && !Array.isArray(config.rules)) {
    throw new Error("[openclash-rules] 当前订阅的 rules 不是数组，无法前置规则。");
  }

  const originalRules = config.rules || [];
  // 同一份已处理配置再次传入时，避免重复添加完全相同的前缀。
  if (!CUSTOM_RULES.every((rule, index) => originalRules[index] === rule)) {
    config.rules = CUSTOM_RULES.concat(originalRules);
  }
  return config;
}
