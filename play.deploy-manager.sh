#!/bin/bash

# 设置错误时退出
set -e

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 设置项目名称
PROJECT_NAME="game-lobby"

# 日志函数
log() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] 成功: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] 错误: $1${NC}"
}

# 检查依赖项
check_dependencies() {
    log "检查依赖项..."
    
    # 检查 Node.js 版本
    if ! command -v node &> /dev/null; then
        error "未安装 Node.js"
        return 1
    fi
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        error "未安装 Docker"
        return 1
    fi
    
    # 检查 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "未安装 Docker Compose"
        return 1
    fi
    
    success "所有依赖项检查完成"
    return 0
}

# 检查环境变量文件
check_env_file() {
    log "检查环境变量配置..."
    local env_file=".env.production"
    
    if [ ! -f "$env_file" ]; then
        error "环境变量文件 $env_file 不存在！"
        return 1
    fi

    # 检查必要的环境变量
    local required_vars=(
        "VITE_FIREBASE_API_KEY"
        "VITE_FIREBASE_PROJECT_ID"
        "VITE_FIREBASE_AUTH_DOMAIN"
    )

    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$env_file"; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        error "以下必需的环境变量缺失："
        printf '%s\n' "${missing_vars[@]}"
        return 1
    fi

    # 创建临时文件处理环境变量
    local temp_env=$(mktemp)
    
    # 只复制标准格式的环境变量行到临时文件
    while IFS= read -r line; do
        # 跳过空行和注释
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        
        # 跳过包含 JSON 格式的行
        [[ "$line" =~ [\{\}] ]] && continue
        
        # 只处理标准的 KEY=VALUE 格式
        if [[ "$line" =~ ^[A-Z_][A-Z0-9_]*= ]]; then
            echo "$line" >> "$temp_env"
        fi
    done < "$env_file"

    # 检查剩余变量的格式
    while IFS='=' read -r key value; do
        # 跳过空行
        [ -z "$key" ] && continue
        
        # 移除前后的空格
        key=$(echo "$key" | xargs)
        
        # 检查键名格式
        if [[ ! "$key" =~ ^[A-Z_][A-Z0-9_]*$ ]]; then
            error "环境变量名格式错误: $key"
            rm "$temp_env"
            return 1
        fi
    done < "$temp_env"
    
    rm "$temp_env"
    success "环境变量检查完成"
    return 0
}

# 管理 SSL 证书
manage_ssl_certificates() {
    log "开始管理 SSL 证书..."
    local DOMAIN="play.saga4v.com"
    local SSL_DIR="/etc/nginx/ssl/${DOMAIN}"
    
    # 创建证书目录
    sudo mkdir -p "$SSL_DIR"
    
    # 检查证书是否存在
    if [ -f "${SSL_DIR}/fullchain.pem" ]; then
        log "检查证书有效期..."
        local EXPIRY=$(sudo openssl x509 -enddate -noout -in "${SSL_DIR}/fullchain.pem" | cut -d= -f2)
        local EXPIRY_EPOCH=$(date -d "${EXPIRY}" +%s)
        local NOW_EPOCH=$(date +%s)
        local DAYS_REMAINING=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
        
        if [ $DAYS_REMAINING -gt 30 ]; then
            success "证书仍然有效，剩余 ${DAYS_REMAINING} 天"
            return 0
        fi
    fi

    # 停止 nginx 服务以释放 80 端口
    log "停止 nginx 服务以申请证书..."
    sudo systemctl stop nginx

    # 申请新证书
    if ! sudo certbot certonly --standalone -d "${DOMAIN}" --non-interactive --agree-tos --email admin@saga4v.com; then
        error "SSL 证书申请失败"
        return 1
    fi

    # 复制证书到 nginx ssl 目录
    sudo cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${SSL_DIR}/
    sudo cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${SSL_DIR}/

    # 设置证书自动续期
    (sudo crontab -l 2>/dev/null; echo "0 0,12 * * * python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew --quiet && docker restart nginx") | sudo crontab -

    success "SSL 证书配置完成"
    return 0
}

# 处理环境变量文件格式
process_env_file() {
    log "处理环境变量文件格式..."
    local env_file=".env.production"
    local env_backup="${env_file}.bak"

    # 如果备份文件不存在，创建备份
    if [ ! -f "$env_backup" ]; then
        log "创建环境变量文件备份..."
        cp "$env_file" "$env_backup"
    fi

    # 读取文件内容到变量中
    local content=$(<"$env_file")
    
    # 检查是否需要处理 FIREBASE_PRIVATE_KEY
    if [[ "$content" =~ FIREBASE_PRIVATE_KEY.*\\\" ]]; then
        log "处理 Firebase 私钥格式..."
        # 使用临时文件避免直接修改
        local temp_file=$(mktemp)
        
        # 处理转义字符
        while IFS= read -r line; do
            if [[ "$line" =~ ^FIREBASE_PRIVATE_KEY= ]]; then
                # 移除转义符并使用单引号
                line=$(echo "$line" | sed 's/\\"/"/g' | sed 's/^FIREBASE_PRIVATE_KEY="\(.*\)"$/FIREBASE_PRIVATE_KEY=\x27\1\x27/')
            fi
            echo "$line" >> "$temp_file"
        done < "$env_file"
        
        # 替换原文件
        mv "$temp_file" "$env_file"
        success "环境变量文件格式处理完成"
    else
        log "环境变量文件格式正常，无需处理"
    fi
    
    return 0
}

# 部署服务
deploy_services() {
    log "开始部署服务..."
    
    # 处理环境变量文件格式
    if ! process_env_file; then
        error "环境变量文件处理失败"
        return 1
    fi
    
    # 导出环境变量
    log "导出环境变量..."
    while IFS='=' read -r key value; do
        # 跳过空行和注释
        [[ -z "$key" || "$key" =~ ^# ]] && continue
        # 跳过包含 JSON 的行
        [[ "$key" =~ FIREBASE_PRIVATE_KEY ]] && continue
        # 导出其他环境变量
        export "$key"="$value"
    done < .env.production
    
    # 停止现有服务
    log "停止现有服务..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # 清理 Docker 资源
    log "清理 Docker 资源..."
    docker system prune -f
    docker volume prune -f
    
    # 构建新服务
    log "构建服务..."
    if ! docker-compose -f docker-compose.prod.yml build --no-cache; then
        error "服务构建失败"
        return 1
    fi
    
    # 启动服务
    log "启动服务..."
    if ! docker-compose -f docker-compose.prod.yml up -d; then
        error "服务启动失败"
        return 1
    fi
    
    success "服务部署完成"
    return 0
}

# 主函数
main() {
    log "开始部署流程..."
    
    # 检查权限
    if [ "$EUID" -ne 0 ]; then 
        error "请使用 sudo 运行此脚本"
        exit 1
    fi
    
    # 检查依赖
    if ! check_dependencies; then
        error "依赖检查失败"
        exit 1
    fi
    
    # 检查环境变量
    if ! check_env_file; then
        error "环境变量检查失败"
        exit 1
    fi
    
    # 管理 SSL 证书
    if ! manage_ssl_certificates; then
        error "SSL 证书管理失败"
        exit 1
    fi
    
    # 部署服务
    if ! deploy_services; then
        error "服务部署失败"
        exit 1
    fi
    
    success "部署完成！"
}

# 运行主函数
main 