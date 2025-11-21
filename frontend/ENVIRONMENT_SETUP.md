# 环境变量配置指南

## Vercel 环境变量设置

### 必需的环境变量

#### `NEXT_PUBLIC_INFURA_API_KEY`
- **用途**: 连接到 Sepolia 测试网络
- **获取方式**:
  1. 访问 https://infura.io
  2. 注册账户
  3. 创建新项目
  4. 复制 API Key
- **示例**: `b18fb7e6ca7045ac83c41157ab93f990`

#### 可选的环境变量

#### `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- **用途**: 支持 WalletConnect 连接
- **获取方式**:
  1. 访问 https://cloud.walletconnect.com
  2. 创建项目
  3. 复制 Project ID

## 在 Vercel 中设置环境变量

1. 在 Vercel 项目控制台中
2. 进入 "Settings" → "Environment Variables"
3. 添加以下变量:
   ```
   NEXT_PUBLIC_INFURA_API_KEY=你的API密钥
   ```

## 本地开发环境变量

创建 `.env.local` 文件:
```bash
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

## MetaMask 配置

确保你的 MetaMask 已添加 Sepolia 网络:
- **Network Name**: Sepolia
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_API_KEY
- **Chain ID**: 11155111
- **Currency Symbol**: SepoliaETH

## 本地开发 vs 生产环境

### 本地开发环境 (NODE_ENV=development)
- ✅ 支持 Hardhat 本地网络 (http://localhost:8545)
- ✅ 支持 Sepolia 测试网络
- ✅ 默认连接到 Hardhat 网络

### 生产环境 (Vercel部署)
- ✅ 仅支持 Sepolia 测试网络
- ✅ 需要设置 INFURA_API_KEY
- ✅ 默认连接到 Sepolia 网络

## MetaMask 网络配置

### 添加 Hardhat 网络 (本地开发)
```
Network Name: Hardhat
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

### 添加 Sepolia 网络 (生产环境)
```
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/YOUR_API_KEY
Chain ID: 11155111
Currency Symbol: SepoliaETH
```

## 测试连接

### 本地开发测试
```bash
# 启动本地Hardhat节点
npm run node

# 在另一个终端启动前端
npm run dev

# 访问 http://localhost:3000
# MetaMask会默认连接到Hardhat网络
```

### 生产环境测试
设置好环境变量后，应用应该能够:
- ✅ 连接到 Sepolia 网络
- ✅ 通过 MetaMask 连接钱包
- ✅ 与智能合约交互