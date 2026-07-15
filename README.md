# Fox Clip

**Fox Clip（狐狸夹子）**：一只可爱的小狐狸把代码片段叼回来——一键复制文件路径与行号。

VS Code extension: copy **file path + line range** to the clipboard in one click.

- 本仓库：https://github.com/Anson-Trio/fox-clip  
- 作者主页：https://github.com/Anson-Trio  

支持语言 / Languages: English · 简体中文 · 繁體中文 · 日本語  
（跟随 VS Code / Cursor 的显示语言自动切换）

## 功能

选中代码（或不选，仅光标所在行）后：

| 命令 | 默认快捷键 | 输出示例 |
|------|------------|----------|
| **复制绝对路径与行号**（右键 / 快捷键） | `Ctrl+Shift+C` / `Cmd+Shift+C` | `/home/you/proj/src/app.ts:12-28` |
| 复制相对路径与行号 | — | `src/app.ts:12-28` |
| 复制绝对路径与代码 | — | 绝对路径:行号 + Markdown 代码块 |

也支持：

- 多光标 / 多选区（自动合并相邻行号）
- 编辑器右键：**复制绝对路径与行号**（一级菜单）；**Fox Clip 更多…** 里可选相对路径或带代码
- 设置里切换 `colon`（`file:10-20`）或 `github`（`file#L10-L20`）格式

## 本地开发

```bash
npm install
npm run compile
```

用 VS Code 打开本仓库，按 `F5` 启动 Extension Development Host 调试。

切换语言测试：命令面板 → `Configure Display Language` → 选择 `zh-cn` / `zh-tw` / `ja` / `en` 后重启。

## 本地安装（不发布）

```bash
npm install
npx vsce package
code --install-extension fox-clip-0.2.3.vsix
```

Cursor 可用：

```bash
cursor --install-extension fox-clip-0.2.3.vsix
```

## 设置

- `foxClip.lineFormat`：`colon`（默认）或 `github`
- `foxClip.includeCodeFence`：带代码复制时是否包 Markdown fence（默认 `true`）
- `foxClip.showNotification`：复制后是否在状态栏提示（默认 `true`）

## 上架 / CI

详见 [PUBLISH.md](./PUBLISH.md)。

- **GitHub**：打 `v*` tag 或发 Release → 自动打包 `.vsix` 并挂到 Release
- **商店**：从 Release 下载 `.vsix`，到 [Marketplace 管理页](https://marketplace.visualstudio.com/manage) 手动上传
