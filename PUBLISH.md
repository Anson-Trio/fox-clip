# 发版说明

商店（VS Code Marketplace）用**手动上传**；GitHub 负责自动打 `.vsix` 并挂到 Release。

## GitHub：自动出包

1. 把 `package.json` 里的 `version` 改成新版本（例如 `0.2.2`），提交并推到 `main`
2. 打 tag 并推送：

```bash
git tag v0.2.2
git push origin v0.2.2
```

或在 GitHub → **Releases** → **Draft a new release**，填 tag（如 `v0.2.2`）后发布。

3. **Release** workflow 会：
   - 编译
   - `vsce package` 生成 `fox-clip-x.y.z.vsix`
   - 把 `.vsix` 挂到该 Release 的 Assets 里

下载地址在仓库的 Releases 页面。

## Marketplace：手动上架 / 更新

1. 从 GitHub Release 下载 `.vsix`
2. 打开 [Marketplace 管理页](https://marketplace.visualstudio.com/manage)
3. 选中你的 publisher → 上传 / 更新扩展

确认 `package.json` 的 `"publisher"` 与管理页 **Unique ID** 一致。

## 本地打包（可选）

```bash
npm ci
npm run compile
npx vsce package
```

生成的 `.vsix` 同样可以拖到管理页上传。
