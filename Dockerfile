FROM node:20-alpine

# Set working directory
WORKDIR /app

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

# 清理、安装、构建
RUN npm run clean && \
    npm install && \
    npm run build

# 安装基本工具
RUN apk add --no-cache curl

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["sh", "-c", "npm run preview"]
