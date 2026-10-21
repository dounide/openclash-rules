# 小火箭（Shadowrocket）

Shadowrocket 支持通过 URL 下载、更新模块。本目录提供原生 `[Rule]` 模块，可叠加到你正在使用的配置中。

模块保留原规则的 49 条启用规则、1 条禁用规则、书写顺序以及 `DIRECT` / `no-resolve` 设置。`AUTO_GROUP` 和 `PROXY_GROUP` 分别保留为可编辑参数。

## 订阅地址

[查看模块原文](https://raw.githubusercontent.com/dounide/openclash-rules/main/shadowrocket/custom-rules.sgmodule)

```text
https://raw.githubusercontent.com/dounide/openclash-rules/main/shadowrocket/custom-rules.sgmodule
```

## 添加并使用

1. 打开小火箭，进入 **配置 → 模块 → 右上角 ＋**。
2. 粘贴上面的地址并下载，开启「自定义分流规则」模块。
3. 点击该模块，打开 **编辑参数**，按下表设置。只想使用当前默认代理时，保留两个 `PROXY` 即可。
4. 回到配置页，对正在使用的配置执行 **使用配置 / 编译配置**，等待完成。
5. 在首页把 **全局路由** 设为 **配置**，再建立连接。已有连接如未切换，可断开后重新连接。

模块规则优先于主配置规则；存在多个模块时，将本模块放在需要它优先于的模块上方。模块无需 HTTPS 解密或证书。

## 两个参数怎么填

| 参数 | 默认值 | 用途 |
| --- | --- | --- |
| `AUTO_GROUP` | `PROXY` | `agentrouter.org` 使用的策略 |
| `PROXY_GROUP` | `PROXY` | 其余需要代理的规则使用的策略 |

`PROXY` 是 Shadowrocket 的内置代理策略，通常使用首页选中的代理节点。**两个默认值不会自动创建「♻️ 自动选择」「🚀 默认代理」等 Clash 策略组，也不代表自动测速选节点。**

如果你的小火箭已经有自动选择的代理分组，把 `AUTO_GROUP` 改为该分组的准确名称。需要新建时，可在 **当前配置的 ⓘ → 代理分组 → ＋** 中建立 `url-test` 类型分组、选好自己的节点，再将该分组名称填入模块参数。`PROXY_GROUP` 同样可以填写本机已有的代理分组或节点名称。名称中的空格和 Emoji 也必须一致。

小火箭使用下面的原生参数语法：

```ini
#!arguments=AUTO_GROUP:PROXY, PROXY_GROUP:PROXY

[Rule]
DOMAIN-SUFFIX,agentrouter.org,{{{AUTO_GROUP}}}
```

通过模块 **编辑参数** 保存的本机值会在模块更新时保留。以后换节点或分组，只改参数即可；不要把 OpenClash 的 `${AUTO_GROUP}`、`[YAML]`、`+rules:` 复制进来。

如果需要改变分享给其他人的默认值，也可以修改本文件顶部 `#!arguments=` 的两个值。统一生成器仅替换规则块，不会重置这一行的默认值；各设备在「编辑参数」中保存的值仍应在设备上分别管理。

## 手动刷新，立即应用

1. 将规则改动提交到 GitHub，等待 Actions 完成自动同步，确认上面的「模块原文」已经出现新规则。
2. 小火箭进入 **配置 → 模块 → 更新模块**，等待下载完成。该操作更新模块，首页的节点订阅刷新是另一项操作。
3. 返回配置页，对当前配置执行 **使用配置 / 编译配置**，完成后重新发起访问；必要时断开并重新连接小火箭。

在较新的小火箭版本中，也可以在 **设置 → 模块** 中开启 **自动后台更新** 并设置间隔；iOS 的后台 App 刷新需要允许小火箭运行。后台调度由系统控制，需要立即生效时使用上述手动步骤。

## 维护规则

日常增删规则，只需修改仓库的统一源文件 [openclash/module.conf](../openclash/module.conf)，提交后由 GitHub Actions 自动同步到各平台。等待自动同步完成，再按上面的步骤更新小火箭模块。完整维护方式见 [仓库首页](../README.md)。

`custom-rules.sgmodule` 中 `# BEGIN GENERATED RULES` 与 `# END GENERATED RULES` 之间由脚本维护，请把规则改动写入统一源文件。生成器会将 OpenClash 的变量转成小火箭参数，并保留禁用规则和顺序；标记外的模块说明和 `#!arguments=` 默认值独立保留。

## 兼容与核实依据

- 适用于支持模块和「编辑参数」的当前 Shadowrocket 版本；旧版本没有此入口时，先更新 App。
- 模块只增加分流规则，需要你已有可用的节点与基础配置。它不是机场节点订阅，也不创建策略组。
- 已对照原始规则检查类型、目标、动作参数、禁用状态与顺序。此仓库不包含 iOS/macOS 小火箭真机运行验证；实际分组名称和节点可用性仍以你的设备为准。
- 文件保持原始书写顺序；Shadowrocket 自身的规则编译与优先级机制仍由该客户端决定，不能保证所有 Clash 专属行为跨客户端一致。

核实来源：

- [Shadowrocket 官方 App Store 页面](https://apps.apple.com/us/app/shadowrocket/id932747118)：URL 规则导入、规则类型，以及模块相关更新记录。
- [官方更新频道的模块参数修复记录](https://t.me/s/ShadowrocketNews?before=900)：模块参数功能。
- [LOWERTOP 原作者模块源码](https://github.com/LOWERTOP/Shadowrocket-First/blob/main/Talkatone.sgmodule)：`#!arguments`、`{{{参数}}}` 在 `[Rule]` 中的具体写法，以及 `PROXY` 默认策略。
- [LOWERTOP 使用手册](https://github.com/LOWERTOP/Shadowrocket/wiki/)：模块导入、编辑参数、配置编译、代理分组与后台更新。该手册为社区维护项目，不是官方文档。
- [GMOogway 规则模块作者的更新说明](https://github.com/GMOogway/shadowrocket-rules/blob/master/docs/02.shadowrocket_update_modules.md)：手动「配置 → 模块 → 更新模块」入口。
