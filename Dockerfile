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

# Production image
FROM nginx:alpine

# Create required directories
RUN mkdir -p /etc/nginx/ssl

# Copy nginx configurations
COPY config/nginx/ssl.conf /etc/nginx/ssl/ssl.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Generate self-signed certificate for development 保持原有的 SSL 相关配置
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/privkey.pem \
    -out /etc/nginx/ssl/fullchain.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" && \
    chmod 644 /etc/nginx/ssl/privkey.pem /etc/nginx/ssl/fullchain.pem

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 5173

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# 启动命令与 package.json 保持一致
CMD ["sh", "-c", "export PATH=/app/node_modules/.bin:$PATH && npm run clean && npm run build && npm run preview"]
