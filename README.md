# 🚀 Noda-Clipboard 社区版

Noda-Clipboard 是一个极简、跨设备、支持加密和定时自动清理的云剪切板系统，适合团队协作和个人多端同步文本。**此为社区开源版本，欢迎贡献和二次开发！**

---

## 🛠️ 技术栈

- **Node.js** + **Express**：后端服务与 API
- **MongoDB** + **Mongoose**：数据存储与建模
- **EJS**：服务端渲染模板引擎
- **Tailwind CSS**：现代化响应式 UI 样式
- **原生 JS**：前端交互（二维码、剪贴板等）

---

## ✨ 主要功能

- 多剪切板隔离，支持自定义 ID
- 可选密码保护，保障隐私安全 🔒
- 剪切板内容自动过期清理 ⏰
- 支持跨设备同步、扫码分享 📱
- 无需注册，开箱即用 🆓
- 简洁现代的 Web UI

---

## 🚦 快速启动

1. **克隆项目**

   ```powershell
   git clone <your-github-repo-url>
   cd app
   ```

2. **安装依赖**

   ```powershell
   npm install
   ```

3. **配置数据库**

   - 修改 `db/config.js`，填写你的 MongoDB 连接信息，或通过环境变量 `DB_IP`、`DB_PORT`、`DB_NAME` 设置。
   - 本项目默认使用本地 MongoDB。

4. **启动服务**

   ```powershell
   npm start
   ```

   默认监听 3000 端口，可通过 [http://localhost:3000](http://localhost:3000) 访问。

---

## 📦 依赖环境

- Node.js >= 14
- MongoDB >= 4

---

## 📁 目录结构

- `bin/www`         启动入口
- `db/`            数据库配置与连接
- `document/`      Mongoose 数据模型
- `routes/`        路由
- `views/`         EJS 模板页面
- `public/`        静态资源

---

## 🤝 贡献指南

- 欢迎 issue、PR、建议和二次开发！🎉
- 请勿提交包含敏感信息的配置或数据。
- 代码风格建议遵循原有格式。

---

## 📄 License

MIT

---

> 🌟 本项目为社区开源版，适合自建、二次开发和学习交流。如果你喜欢，欢迎 star！
