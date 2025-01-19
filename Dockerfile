FROM node:20-alpine

# Set working directory
WORKDIR /app

# 先安装基础工具
RUN apk add --no-cache curl

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

# 使用 serve 来托管构建后的文件
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:5173"]
