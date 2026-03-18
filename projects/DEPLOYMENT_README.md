# Jade's Daily Planner - 飞书部署

## 📱 应用信息

**应用名称：** Jade's Daily Planner
**应用类型：** 日常管理助手 - 每日语录 + 待办清单 + AI智能规划
**部署方式：** 前端云部署 + 后端本地运行 + 内网穿透

## 🎯 核心功能

- ✅ **每日语录（Jade's Daily Schedule）** - 每天一句正能量
- ✅ **今日待办** - 琐事/日常/生活学习三分类管理
- ✅ **每日灵感** - AI自动生成执行步骤，并创建待办事项
- ✅ **日历统计** - 查看每月完成进度和每日详情

## 🚀 快速开始

### 方式1：查看快速部署清单（推荐新手）

👉 打开 [快速部署清单.md](./快速部署清单.md)

### 方式2：查看详细部署指南

👉 打开 [飞书部署指南.md](./飞书部署指南.md)

### 方式3：查看测试指南

👉 打开 [测试指南.md](./测试指南.md)

## 📦 部署架构

```
┌─────────────────────────────────────────────────┐
│                飞书工作台                          │
│                                                   │
│  ┌─────────────┐    ┌─────────────────────────┐  │
│  │  飞书网页应用  │◄──┤  前端（Vercel/云服务）   │  │
│  │             │    │  https://your-app.com   │  │
│  └─────────────┘    └─────────┬───────────────┘  │
│                               │                   │
│                               ▼                   │
│                    ┌──────────────────────┐      │
│                    │  后端API              │      │
│                    │  (本地 + 内网穿透)    │      │
│                    └──────────────────────┘      │
└─────────────────────────────────────────────────┘
```

## 🔧 构建命令

### 构建Web版本
```bash
node build-web.js
```

### 部署到Vercel
```bash
# 需要先安装vercel CLI
npm install -g vercel
vercel --prod
```

### 部署到Netlify
```bash
# 需要先安装netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist-web
```

## ⚙️ 环境变量配置

前端需要配置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `EXPO_PUBLIC_BACKEND_BASE_URL` | 后端API地址 | `http://your-frp-server.com:6000/api/v1` 或 `http://localhost:9091/api/v1` |

### 配置位置

**Vercel：**
1. 进入项目设置
2. Settings > Environment Variables
3. 添加变量

**Netlify：**
1. 进入项目设置
2. Site settings > Environment variables
3. 添加变量

## 🌐 内网穿透配置

### 方式1：frp（推荐，稳定）

**frpc.ini 配置：**
```ini
[common]
server_addr = your-frp-server.com
server_port = 7000

[jade-api]
type = tcp
local_ip = 127.0.0.1
local_port = 9091
remote_port = 6000
```

### 方式2：ngrok（测试，简单）

```bash
ngrok http 9091
```

会得到临时URL：`https://xxx.ngrok.io`

### 方式3：云服务器（生产环境）

购买云服务器，部署后端服务，配置防火墙开放9091端口。

## 📱 飞书应用配置

### 创建应用

1. 访问 https://open.feishu.cn/app
2. 创建"网页应用"
3. 配置基本信息：
   - 名称：Jade's Daily Planner
   - 描述：日常管理助手
   - 图标：上传应用图标
4. 配置网页地址：
   - PC端：`https://your-app.vercel.app`
   - 移动端：`https://your-app.vercel.app`
5. 发布应用

### 测试访问

1. 在飞书工作台找到应用
2. 点击打开
3. 测试所有功能

## 🗄️ 数据管理

### 数据库位置
```
server/data/jade-daily.db
```

### 备份数据库
```bash
cp server/data/jade-daily.db backup/jade-daily-$(date +%Y%m%d).db
```

### 恢复数据库
```bash
cp backup/jade-daily-20260318.db server/data/jade-daily.db
```

## 🔍 故障排查

### 前端正常，API失败

检查：
1. 后端是否运行：`curl http://localhost:9091/api/v1/health`
2. 环境变量是否正确
3. CORS是否配置
4. 内网穿透是否正常

### 飞书中显示空白

检查：
1. URL是否使用HTTPS
2. 浏览器控制台错误（F12）
3. 普通浏览器访问同一URL

### AI生成不工作

检查：
1. 后端日志
2. AI API密钥配置
3. 网络连接

## 📚 相关文档

- [快速部署清单.md](./快速部署清单.md)
- [飞书部署指南.md](./飞书部署指南.md)
- [测试指南.md](./测试指南.md)

## 💡 提示

1. **首次部署**：建议使用 ngrok 快速测试
2. **正式使用**：建议使用 frp 或云服务器
3. **定期备份**：每周备份一次数据库
4. **监控日志**：关注后端日志，及时发现问题

## 🎉 开始部署

选择你需要的文档，开始部署吧！

- 新手 👉 [快速部署清单.md](./快速部署清单.md)
- 详细 👉 [飞书部署指南.md](./飞书部署指南.md)
- 测试 👉 [测试指南.md](./测试指南.md)

---

**享受你的日常管理助手！** 🚀
