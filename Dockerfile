FROM node:20-alpine

# Set working directory
WORKDIR /app

# 安装基础工具 (使用 net-tools 替代 netstat-nat)
RUN apk add --no-cache curl net-tools

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5173
ENV VITE_USE_HTTPS=true

# 修改构建和启动命令
RUN npm run build

# 安装 serve 工具来托管静态文件
RUN npm install -g serve

# 暴露端口
EXPOSE 5173

# 使用 shell 形式的 CMD 以确保环境变量被正确解析
CMD serve -s dist -l tcp://0.0.0.0:5173
