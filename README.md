# OpenClash 自定义规则订阅

通过在线覆写模块维护自定义分流规则，保留原始 49 条规则的先后顺序。

| 策略 | 启用规则数 |
| --- | ---: |
| 自动选择 | 1 |
| 默认代理 | 28 |
| DIRECT 直连 | 20 |
| 合计 | 49 |

另外保留了 1 条被注释的 IP 规则，它不会生效。本规则没有拦截条目。

## 订阅地址

将以下地址填写到 OpenClash 的“覆写模块 → 订阅链接”中：

```text
https://raw.githubusercontent.com/dounide/openclash-rules/main/openclash/module.conf
```

[查看模块源码](https://github.com/dounide/openclash-rules/blob/main/openclash/module.conf) · [打开订阅原文](https://raw.githubusercontent.com/dounide/openclash-rules/main/openclash/module.conf)

这是 OpenClash 覆写模块订阅，应添加到“覆写模块”入口。

## 导入

1. 复制上方订阅地址。
2. 打开 **OpenClash → 运行状态 → 顶部“覆写模块” → 添加新模块 → 订阅链接**。
3. 粘贴订阅地址，填写模块名称，例如“个人分流规则”。匹配配置选择当前配置，或 `all`。
4. 在环境变量／额外参数字段中粘贴以下内容：

   ```text
   AUTO_GROUP=♻️ 自动选择;PROXY_GROUP=🚀 默认代理
   ```

5. 确认配置中存在上述两个策略组，启用模块，然后点击 OpenClash 运行状态页的 **重启**。

参数中的值必须与当前配置中的策略组名称完全一致，包含空格及 Emoji。分享给别人时，对方只需在自己的设备上修改这两个参数。模块不会新建策略组或订阅节点。

本文件使用新版 OpenClash 的 `[YAML]`、`+rules` 与模块参数展开语法，已按官方 v0.48.002 的机制编写。旧版本若没有相应入口或不支持参数展开，需要使用支持这些功能的版本。

## 更新与维护

- 日常直接在 GitHub 编辑 [openclash/module.conf](https://github.com/dounide/openclash-rules/edit/main/openclash/module.conf)，在 `+rules:` 中新增、修改或删除规则，提交保存。
- 手动更新：在 OpenClash 的覆写模块列表刷新该模块，再重启插件。刷新按钮本身不负责应用新规则。
- 定时更新：在模块设置中选择更新日和小时。文件中的 `[General] RESTART = true` 会让定时下载成功后自动重启 OpenClash；可安排在闲时。若不需要自动重启，改为 `false`，之后手动重启应用。
- 模块下载、保存、启用和重启是不同操作。保存或只切换开关后，仍需重启插件才能应用。
- 请避免在同一配置里同时启用内容重复的模块。

## 规则说明

- `DOMAIN` 精确匹配完整域名；`DOMAIN-SUFFIX` 匹配域名及其子域；`DOMAIN-KEYWORD` 按关键字匹配。
- `+rules:` 把规则前置到原有规则列表，按从上到下的顺序优先匹配。请保留加号；直接写 `rules:` 会替换原有规则列表。
- 自动选择和默认代理分别使用 `${AUTO_GROUP}` 与 `${PROXY_GROUP}`，导入时由模块参数替换。
- `DIRECT` 为直连。启用的 IP 规则保留 `no-resolve`，避免仅为匹配该规则而额外解析域名。
- 原输入中 15 条域名规则带有无效的 `no-resolve` 参数，整理时已移除；域名、匹配类型、备注、启用状态和规则顺序均保留。
- `38.76.197.172/32` 保持注释禁用，`121.205.88.174/32` 保持启用。

## 参考

- [OpenClash 官方覆写模块示例](https://github.com/vernesong/OpenClash/blob/v0.48.002/luci-app-openclash/root/etc/openclash/overwrite/default)
- [Mihomo 路由规则](https://wiki.metacubex.one/config/rules/)
