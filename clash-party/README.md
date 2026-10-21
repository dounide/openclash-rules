# Clash Party 自定义规则覆写

Clash Party 支持通过 URL 导入 JavaScript 覆写。本文件采用官方 `main(config)` 接口，把自定义规则按原顺序插入现有规则前面；保留原订阅的节点、策略组、DNS 和原规则末尾。

共 **49 条启用规则、1 条注释禁用规则**，来自本仓库的 `openclash/module.conf`。`DOMAIN`、`DOMAIN-SUFFIX`、`DOMAIN-KEYWORD`、`IP-CIDR` 及 `no-resolve` 均保持原意。

## 订阅地址

```text
https://raw.githubusercontent.com/dounide/openclash-rules/main/clash-party/override.js
```

这是“覆写”页面使用的脚本链接。节点订阅仍在“订阅管理”中单独添加。

## 首次使用

1. 使用 Clash Party **标准模式**。在 v2.0.4 中可到 **设置 → 配置模式 → 标准模式** 切换；简易模式走另一套配置生成流程，不执行本教程中的传统覆写。
2. 先查看当前订阅实际有哪些策略组。如名称与下方默认值不一致，先在 GitHub 修改脚本顶部两行并提交。
3. 打开左侧 **覆写**，粘贴上面的完整 `.js` 地址，点击 **导入**。卡片应显示 **JavaScript**。
4. 打开 **订阅管理 → 目标订阅的 ⋯ → 编辑信息**，在 **覆写** 一项添加 `override.js`，然后保存。只要当前启用的是这个订阅，保存会重新应用配置。
5. 使用 **规则模式**，让流量按这些规则分流。需要让所有订阅使用本覆写时，也可在覆写卡片打开“全局启用”，前提是所有订阅均有对应策略组。

有多个覆写同时改规则时，应把本覆写放在目标订阅覆写列表中这些覆写之后，避免后续脚本覆盖新规则。应用后可在客户端的规则页核对实际顺序。

## 统一修改策略组

在 GitHub 打开 [override.js 的编辑页面](https://github.com/dounide/openclash-rules/edit/main/clash-party/override.js)，只改顶部两行：

```javascript
const AUTO_GROUP = "♻️ 自动选择";
const PROXY_GROUP = "🚀 默认代理";
```

这里是实际 JavaScript 赋值，改一处即可更新所有引用该名称的规则。名称须与当前订阅中的策略组完全一致，包括空格和 Emoji。Clash Party 不需要填写 OpenClash 那种环境变量表单；脚本也不会凭空创建代理组。统一生成器会保留这两行赋值。

客户端里临时编辑远程脚本的改动，会被下一次远程刷新覆盖。需要长期保留的修改，请保存到 GitHub；如果多人共用这份链接但各自的组名不同，可各自 fork 仓库并使用自己的 Raw 地址。

## 新增规则与手动立即更新

1. 在仓库编辑统一规则源 [openclash/module.conf](https://github.com/dounide/openclash-rules/edit/main/openclash/module.conf)，在 `+rules:` 下增删规则并提交。继续引用 `${AUTO_GROUP}` 或 `${PROXY_GROUP}` 即可；需要直连的规则填 `DIRECT`。等待仓库的 GitHub Actions 同步任务成功，再确认本页订阅原文中出现新规则。
2. 回到 Clash Party **覆写** 页面，点击这个远程覆写卡片右上角的 **↻ 刷新**。
3. 在已核对的 v2.0.4 中，这个按钮会先下载脚本，再自动重新加载当前配置，正常无需另行重启。当前启用的订阅必须已经绑定此脚本；仅刷新没有绑定的脚本不会改变该订阅。
4. 打开卡片 **⋯ → 执行日志**，确认脚本执行成功。如果旧版刷新后没有应用，可重新启用目标订阅或重启内核。

统一源中的新增规则示例（放在 `+rules:` 下、保持缩进）：

```yaml
  - "DOMAIN-SUFFIX,example.com,${PROXY_GROUP}"
  - "DOMAIN-SUFFIX,example.org,DIRECT"
```

脚本的 `BEGIN GENERATED RULES` / `END GENERATED RULES` 之间由生成器维护，直接编辑这个区块会在下次同步时被覆盖。只改策略组名称时，仍直接编辑 `override.js` 顶部两行。

修改后仍看到旧规则时，先打开 [订阅原文](https://raw.githubusercontent.com/dounide/openclash-rules/main/clash-party/override.js) 确认内容。GitHub Raw 的缓存可能稍后才更新。

## 策略组不匹配时

脚本会在修改规则前检查两组名称，缺失时在 **执行日志** 中给出缺失名称和当前订阅已有的策略组。Clash Party v2.0.4 会记录脚本错误并保留该脚本执行前的配置，因此“能够联网”不代表这个覆写已经成功。修正名称、提交、刷新，再检查日志即可。

脚本保留注释禁用的 `38.76.197.172/32`，不会把它自动启用。

## 核实范围与官方依据

于 **2026-10-21** 核对官方文档及 **Clash Party v2.0.4** 源码。旧版同源客户端可能显示 Mihomo Party 名称，界面入口可能有差异。

- [官方覆写说明](https://clashparty.org/docs/guide/override)：远程导入、绑定订阅和全局启用。
- [官方 JavaScript 说明](https://clashparty.org/docs/guide/override/javascript)：`main(config)` 接收并返回配置。
- [官方 v2.0.4 远程覆写按钮实现](https://github.com/mihomo-party-org/clash-party/blob/v2.0.4/src/renderer/src/components/override/override-item.tsx)：刷新后自动重新加载。
- [官方 v2.0.4 配置生成实现](https://github.com/mihomo-party-org/clash-party/blob/v2.0.4/src/main/core/factory.ts)：标准模式覆写顺序、脚本运行和错误日志行为。
- [官方 v2.0.4 发布页](https://github.com/mihomo-party-org/clash-party/releases/tag/v2.0.4)。

验证包括 JavaScript 语法、官方同款 Node VM 入口、规则源逐条一致、原配置保留及缺失策略组错误。未在用户实际安装的 Clash Party 上进行导入和联网实测。
