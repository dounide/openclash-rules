# FlClash 远程规则扩展

FlClash 支持 JavaScript 扩展脚本，并可通过 URL 导入和手动同步。本目录使用官方 `main(config)` 接口，将自定义规则放到现有订阅规则之前，保留原来的节点、策略组及末尾兜底规则。

已按 **FlClash v0.9.1（2026-10-17 发布）**的官方源代码核对，核对日期为 **2026-10-21**。此版本中文界面使用“扩展”这个名称，部分旧版界面称为“覆写”。

## 订阅地址

[打开远程脚本](https://raw.githubusercontent.com/dounide/openclash-rules/main/flclash/rules.js)

```text
https://raw.githubusercontent.com/dounide/openclash-rules/main/flclash/rules.js
```

这个地址应导入到“脚本”页面，供已有机场订阅或本地完整配置使用。

## 第一次使用

1. 先确认已有配置可以正常连接，并把运行模式设为“规则”。
2. 打开 [rules.js 编辑页面](https://github.com/dounide/openclash-rules/edit/main/flclash/rules.js)，将文件顶部两个值改成该配置中实际存在的策略组名称，提交保存：

   ```javascript
   const AUTO_GROUP = "♻️ 自动选择";
   const PROXY_GROUP = "🚀 默认代理";
   ```

   `AUTO_GROUP` 用于 `agentrouter.org`；`PROXY_GROUP` 用于原来指定默认代理的规则；`DIRECT` 规则仍然直连。两个常量都应填写当前配置已有的策略组名称，空格和 Emoji 也须一致。以后更换组名只改这两行；仓库自动生成规则时会保留这些设置。

3. 在 FlClash 的“配置”中，对正在使用的配置打开菜单，选择 **扩展 → 扩展模式：脚本 → 前往配置脚本**。部分旧版入口是 **更多 → 覆写**。
4. 在脚本页点击 **添加 → 通过URL导入**，粘贴上面的远程脚本地址。也可从 **工具 → 进阶配置 → 脚本**进入同一页面。
5. 返回该配置的“扩展”页面，选中刚导入的 `rules` 脚本，退出扩展页面。v0.9.1 会重新应用配置。
6. 在该配置的菜单 **更多 → 运行时配置**中检查：前面应出现 `agentrouter.org` 等自定义规则，原来的 `MATCH` 兜底仍在后面。配置中已有其他附加规则时，它们也可能出现在这些规则之前。

同一配置当前只能选一个扩展脚本。如果已有其他脚本，需要把两者逻辑合并到同一个 `main(config)` 入口。新建“自定义配置”的管理路径不同，本脚本面向已有的 URL/文件配置。

若脚本页没有“通过URL导入”，可升级到上述已核对版本；也可以打开远程脚本原文，将全部内容粘贴为本地脚本，但以后的更新需要手动重新粘贴。

## 新增规则并立刻使用

1. 在 GitHub 编辑统一源文件 [openclash/module.conf](https://github.com/dounide/openclash-rules/edit/main/openclash/module.conf)，在 `+rules:` 下添加、修改或删除规则并提交，例如：

   ```yaml
     - "DOMAIN-SUFFIX,example.com,${PROXY_GROUP}" # 默认代理
     - "DOMAIN-SUFFIX,example.org,${AUTO_GROUP}" # 自动选择
     - "DOMAIN-SUFFIX,example.net,DIRECT" # 直连
   ```

   保持与源文件中其他规则相同的缩进。规则按源文件顺序匹配；需要更高优先级的规则放在前面。

2. 等待本仓库 [GitHub Actions](https://github.com/dounide/openclash-rules/actions) 的规则生成任务成功。它会同步更新各平台文件，只替换 `rules.js` 中 `BEGIN GENERATED RULES` 与 `END GENERATED RULES` 之间的规则块，保留文件顶部的两个策略组设置。
3. 在 FlClash 的 **脚本列表**中，对这个远程脚本打开菜单（电脑右键、触屏长按），选择 **同步**，等待下载完成。
4. v0.9.1 在当前配置已选中该脚本时，会自动重新应用。若使用旧版或没有观察到配置变化，可退出设置页后停止再启动连接，并在运行时配置中确认新增规则。

节点订阅和扩展脚本各自保存 URL；新增规则后应同步这个脚本条目。长期维护时，规则增删改统一源文件，FlClash 策略组名称改 GitHub 上 `rules.js` 顶部常量。自动生成会覆盖生成块内的手动修改；客户端直接编辑远程脚本的修改也会被下一次同步覆盖。

若同步后仍是旧内容，先打开上面的远程脚本地址检查新增规则；GitHub Raw 缓存更新可能需要一点时间。

若提示“缺少策略组”，错误信息会同时列出当前配置的可用策略组。复制对应的准确名称，修改 GitHub 上 `rules.js` 顶部的 `AUTO_GROUP`、`PROXY_GROUP` 后重新同步。脚本会先检查这两个策略组；缺组时直接报错，尚未改写输入配置的 `rules`。若当前配置没有策略组，请先使用包含所需策略组的完整配置。

## 规则与验证范围

- 初始内容与仓库的 [OpenClash 模块](../openclash/module.conf)一致：**49 条启用规则、1 条禁用规则**，顺序、目标和动作保持对应。
- `38.76.197.172/32` 继续以注释形式禁用；`121.205.88.174/32` 保留 `no-resolve`。
- 脚本使用输入配置已有的节点和策略组，不生成节点或策略组，也不添加新的 `MATCH` 兜底。
- 已在 Node.js 隔离 VM 中按官方“解析 JSON → 调用 `main(config)` → 返回 JSON 配置”的调用方式验证规则数量、顺序、变量替换、原规则及兜底保留，并检查同一规则块重复执行不会堆叠、缺组报错时不改写原规则。未在用户的 FlClash 设备上完成实际连接测试。

## 官方依据

- [v0.9.1 发布记录](https://github.com/chen08209/FlClash/releases/tag/v0.9.1)
- [脚本列表、URL 导入及同步菜单](https://github.com/chen08209/FlClash/blob/v0.9.1/lib/views/config/scripts.dart)
- [远程脚本同步后重新应用当前配置](https://github.com/chen08209/FlClash/blob/v0.9.1/lib/providers/actions/scripts.dart)
- [扩展模式及离开页面后重新应用](https://github.com/chen08209/FlClash/blob/v0.9.1/lib/views/profiles/extend/extend.dart)
- [`main(config)` 的执行接口](https://github.com/chen08209/FlClash/blob/v0.9.1/plugins/rust_api/rust/src/script/mod.rs)
- [脚本执行及配置合成顺序](https://github.com/chen08209/FlClash/blob/v0.9.1/lib/providers/actions/setup.dart)
