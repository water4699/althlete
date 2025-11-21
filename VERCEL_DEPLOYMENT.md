# Vercel 部署指南

## 🚀 运动员注册系统 - Vercel 部署

本项目是一个基于 FHE (Fully Homomorphic Encryption) 的隐私保护运动员注册系统。

## 📋 前置要求

1. **GitHub 仓库**: 项目已推送到 https://github.com/water4699/althlete.git
2. **Vercel 账户**: 访问 https://vercel.com 注册账户
3. **MetaMask**: 用户需要安装 MetaMask 浏览器扩展

## 🔧 部署步骤

### 步骤 1: 连接 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 连接到你的 GitHub 账户
5. 选择 `water4699/althlete` 仓库

### 步骤 2: 配置构建设置

在 Vercel 项目设置中配置以下参数：

#### Build & Development Settings:
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next (自动检测)
Install Command: npm install
```

#### Environment Variables:
添加以下环境变量（如果需要）：
```
INFURA_API_KEY=your_infura_api_key_here
```

### 步骤 3: 部署配置

Vercel 会自动检测 `vercel.json` 配置文件：

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "rootDirectory": "frontend"
}
```

### 步骤 4: 部署项目

1. 点击 "Deploy"
2. 等待构建完成（大约 2-3 分钟）
3. 获得部署的 URL

## 🌐 访问应用

部署成功后，你会获得一个 URL，格式类似：
- `https://athlete-registration-system.vercel.app`
- 或 `https://althlete-[random].vercel.app`

## 🔧 本地测试部署

在部署前，可以本地测试：

```bash
cd frontend
npm run build
npm run start
```

访问 `http://localhost:3000` 测试功能。

## ⚠️ 重要注意事项

### 区块链网络配置
- **本地开发**: 使用 Hardhat 节点 (http://localhost:8545)
- **生产环境**: 需要连接到 Sepolia 测试网或主网
- **MetaMask**: 用户需要配置正确的网络

### 合约部署
- 本项目使用 Sepolia 测试网合约
- 合约地址已配置在 `frontend/abi/AthleteRegistrationAddresses.ts`

### 环境变量
- `INFURA_API_KEY`: 用于连接 Infura RPC 节点
- 可在 Vercel 项目设置中添加

## 🔍 故障排除

### 构建失败
1. 检查 `frontend/package.json` 依赖是否完整
2. 确认 `vercel.json` 配置正确
3. 查看 Vercel 构建日志

### 运行时错误
1. 检查浏览器控制台错误
2. 确认 MetaMask 已连接到正确网络
3. 验证合约地址是否正确

### 网络连接问题
1. 确认 Infura API Key 已设置
2. 检查网络配置是否正确

## 📞 支持

如果遇到问题，请检查：
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [项目 Issues](https://github.com/water4699/althlete/issues)

---

**🎉 部署成功后，你的运动员注册系统就可以在全球范围内访问了！**
