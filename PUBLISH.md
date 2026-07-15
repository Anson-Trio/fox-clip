# 发布到 VS Code Marketplace 说明

## 1. 确认 publisher

打开 [Marketplace 管理页](https://marketplace.visualstudio.com/manage)，看你的 **Publisher Unique ID**。

`package.json` 里的 `"publisher"` 必须和这个 Unique ID **完全一致**。

> 注意：Unique ID 一般是短名字（如 `anson`），不是 Azure 组织的 UUID。  
> 若当前填的是一长串 GUID，请改成管理页上显示的那个 Unique ID。

## 2. 创建 Azure DevOps PAT

1. 打开 [Azure DevOps](https://dev.azure.com/)（用同一 Microsoft 账号）
2. 右上角头像 → **Personal access tokens** → **New Token**
3. Organization 选 **All accessible organizations**（或你的组织）
4. Scopes：**Marketplace** →勾选 **Manage**
5. 创建后复制 token（只显示一次）

## 3. 配到 GitHub Secrets

仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- Name: `VSCE_PAT`
- Value: 刚才的 PAT

## 4. 怎么触发发布

**推荐：打 GitHub Release**

1. 本地或在 GitHub 上把 `package.json` 的 `version` 改成新版本（如 `0.2.2`）并推到 `main`
2. GitHub → **Releases** → **Draft a new release**
3. Tag 例如 `v0.2.2`，发布 Release
4. `Publish` workflow 会自动 `vsce publish`

**或：手动跑 Actions**

- Actions → **Publish** → **Run workflow**
- 可选 patch / minor / major 自动升版本再发布

## 5. 首次也可本地试发

```bash
npx vsce login <你的publisher-id>
npx vsce publish
```
