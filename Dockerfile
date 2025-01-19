FROM node:20-alpine as builder

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

# Build the application
RUN npm run build

# 使用 node 运行预览服务
FROM node:20-alpine

WORKDIR /app

# 安装基本工具
RUN apk add --no-cache curl

# 只复制必要的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# 暴露端口
EXPOSE 5173

# 使用 preview 命令启动服务
CMD ["sh", "-c", "export PATH=/app/node_modules/.bin:$PATH && npm run preview:prod"]
