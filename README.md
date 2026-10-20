# 渡劫 · gjsvip 个人官网（www.520691.xyz）

全栈独立开发者「渡劫（gjsvip）」的个人主页：终端 Hero + Bento 作品集 + 技能栈 + 数据统计 + 友链。深色默认 / 亮色切换，青蓝紫渐变 + 玻璃态设计体系，纯静态零外部依赖，Cloudflare Pages 自动部署。

- **官网**：https://www.520691.xyz/
- **博客**：https://blog.520691.xyz/
- **渡劫code（旗舰项目，云端 IDE）**：https://dujie_cone.520691.xyz/
- **GitHub**：https://github.com/gjsvip ｜ **Gitee**：https://gitee.com/dujie_nb_admin
- **邮箱**：3450211748@qq.com

## 设计体系

- 深色默认 + 亮色主题（`localStorage` 记忆，`data-theme` 切换，首屏前应用无闪烁）
- 渐变体系：`#38bdf8 → #818cf8 → #c084fc`
- 玻璃态卡片（`backdrop-filter`）+ Bento Grid 布局 + 鼠标跟随高光
- Terminal 风格 Hero：`$ whoami` 打字机效果 + 渐变光晕背景
- scroll-reveal 入场动画、技能条动画、数字 count-up
- 全部动画尊重 `prefers-reduced-motion`；无 JS 时内容完整降级可见
- 零外部 CDN 依赖（无 Web Font / 无统计脚本 / 无外链图片），国内可达
- 响应式，640px 断点

## 目录结构

```
homepage/
├── index.html                              # 单页官网（结构 + SEO + JSON-LD）
├── assets/
│   ├── style.css                           # 设计体系：令牌 / 玻璃态 / Bento / 响应式
│   └── app.js                              # 交互：主题 / 打字机 / reveal / count-up
├── robots.txt
├── sitemap.xml
├── 31cc0198701c4fe594f4064e87007b54.txt    # IndexNow 密钥（勿改内容）
├── 51734a6916d2725aa31f3e62ef9a59b5.txt    # IndexNow 密钥（勿改内容）
├── .nojekyll
└── .github/workflows/deploy.yml            # Cloudflare Pages 部署（勿动）
```

## 本地预览

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## 部署

推送到 `main` 即触发 GitHub Actions → Cloudflare Pages（345 账号，项目名 `gjsvip-homepage`），自定义域名 `www.520691.xyz`。Secrets 已配好，无需额外操作。

## 收录（SEO）

- `title` / `description` / `keywords` / `canonical` / OG / Twitter Card 均已配置
- JSON-LD `Person` schema（`sameAs` 含现行域名体系）
- `robots.txt` + `sitemap.xml` 已就位
- IndexNow 密钥文件托管于根路径，收录提交时使用
