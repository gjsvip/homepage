# gjsvip 个人官网（www.520691.xyz）

小开发者 gjsvip 的个人主页：渡劫code 项目展示 + 个人介绍 + 页脚友链。深色 IDE 风格，纯静态零依赖，Cloudflare Pages 自动部署。

- **线上地址**：https://www.520691.xyz
- **渡劫code**：https://dujie_cone.520691.xyz
- **博客**：https://blog.520691.xyz
- **GitHub Pages 镜像**：https://gjsvip.github.io/

## 本地预览

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## 部署

推送到 `main` 即触发 GitHub Actions → Cloudflare Pages（345 账号，项目名 `gjsvip-homepage`），自定义域名 `www.520691.xyz`。

所需 Secrets（仓库 Settings → Secrets and variables → Actions）：

| Secret | 值 |
|---|---|
| `CF_API_TOKEN` | Cloudflare API 令牌（345 账号，需 Pages:Edit） |
| `CLOUDFLARE_ACCOUNT_ID` | `f608546bec281f207409d11f3be5c89d` |

## 收录（SEO）

- `robots.txt` + `sitemap.xml` 已就位
- IndexNow 密钥 `51734a6916d2725aa31f3e62ef9a59b5.txt` 托管于根路径，收录提交时使用

## 目录结构

```
homepage/
├── index.html                              # 单页官网（内联样式）
├── robots.txt
├── sitemap.xml
├── 51734a6916d2725aa31f3e62ef9a59b5.txt    # IndexNow 密钥
├── .nojekyll
└── .github/workflows/deploy.yml            # Cloudflare Pages 部署
```
