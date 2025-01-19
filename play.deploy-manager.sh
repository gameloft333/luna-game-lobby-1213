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

# 检查容器日志
check_container_logs() {
    local container_name=$1
    log "检查 ${container_name} 容器日志..."
    
    # 获取容器ID
    local container_id=$(docker-compose -f docker-compose.prod.yml ps -q $container_name)
    
    if [ -z "$container_id" ]; then
        error "找不到 ${container_name} 容器"
        return 1
    fi
    
    # 如果是 frontend 容器，检查 npm 命令是否可用
    if [ "$container_name" = "frontend" ]; then
        log "检查 npm 命令是否可用..."
        if ! docker exec $container_id which npm > /dev/null; then
            error "容器中未找到 npm 命令"
            return 1
        fi
        success "npm 命令检查通过"
    fi
    
    # 显示容器状态
    log "容器状态信息："
    docker inspect --format='状态: {{.State.Status}}, 健康状态: {{.State.Health.Status}}' $container_id
    
    # 显示最近的日志
    log "${container_name} 最近日志："
    docker logs --tail=50 $container_id
    
    return 0
}

# 检查容器文件系统
check_container_files() {
    local container_name=$1
    log "检查容器 ${container_name} 的文件系统..."
    
    # 检查工作目录
    log "1. 检查工作目录内容..."
    docker exec ${container_name} ls -la /app || {
        error "无法访问工作目录"
        return 1
    }
    
    # 检查 package.json
    log "2. 检查 package.json..."
    docker exec ${container_name} cat /app/package.json || {
        error "无法读取 package.json"
        return 1
    }
    
    # 检查构建目录
    log "3. 检查构建目录..."
    docker exec ${container_name} ls -la /app/dist || {
        error "无法访问构建目录"
        return 1
    }
    
    success "容器文件系统检查完成"
    return 0
}

# 等待前端服务启动并诊断问题
wait_and_diagnose_frontend() {
    log "等待前端服务就绪..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # 检查容器是否运行
        if ! docker ps | grep -q "luna-game-frontend.*Up"; then
            if [ $attempt -eq $max_attempts ]; then
                error "前端容器未能正常启动"
                return 1
            fi
            log "等待容器启动... (${attempt}/${max_attempts})"
            sleep 5
            attempt=$((attempt + 1))
            continue
        fi
        
        # 检查容器文件系统
        if ! check_container_files "luna-game-frontend"; then
            if [ $attempt -eq $max_attempts ]; then
                error "容器文件系统检查失败"
                return 1
            fi
            log "等待文件系统就绪... (${attempt}/${max_attempts})"
            sleep 5
            attempt=$((attempt + 1))
            continue
        fi
        
        # 检查服务可用性
        if curl -s "http://localhost:5173" >/dev/null 2>&1; then
            success "前端服务已就绪"
            return 0
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            log "等待服务响应... (${attempt}/${max_attempts})"
            sleep 5
            attempt=$((attempt + 1))
            continue
        fi
        
        error "服务启动但无法访问，收集诊断信息..."
        docker logs luna-game-frontend --tail 100
        return 1
    done
    
    error "前端服务启动失败"
    return 1
}

# 检查并更新 Nginx 配置
check_and_update_nginx_conf() {
    log "检查 Nginx 配置文件..."
    local server_conf="/etc/nginx/conf.d/play.conf"
    local local_conf="./conf.d/play.conf"
    local backup_dir="/etc/nginx/conf.d/backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    # 检查本地配置文件是否存在
    if [ ! -f "$local_conf" ]; then
        error "本地 Nginx 配置文件不存在: $local_conf"
        return 1
    fi
    
    # 创建备份目录
    if [ ! -d "$backup_dir" ]; then
        log "创建备份目录..."
        sudo mkdir -p "$backup_dir"
    fi

    # 确保 Docker 网络和服务已经启动
    log "确保 Docker 服务正常运行..."
    
    # 1. 先停止所有服务
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # 2. 确保网络存在
    docker network create app_network 2>/dev/null || true
    
    # 3. 启动前端服务
    log "启动前端服务..."
    if ! docker-compose -f docker-compose.prod.yml up -d frontend; then
        error "前端服务启动失败"
        return 1
    fi
    
    # 启动并诊断前端服务
    if ! wait_and_diagnose_frontend; then
        error "前端服务启动失败，终止 Nginx 配置更新"
        # 清理资源
        docker-compose -f docker-compose.prod.yml down
        return 1
    fi
    
    # 备份当前配置
    if [ -f "$server_conf" ]; then
        log "备份当前服务器配置..."
        sudo cp "$server_conf" "${backup_dir}/play.conf.${timestamp}.bak"
    fi
    
    # 更新配置
    log "更新 Nginx 配置..."
    sudo cp "$local_conf" "$server_conf"
    
    # 测试新配置
    log "测试新的 Nginx 配置..."
    if ! sudo nginx -t; then
        error "新的 Nginx 配置测试失败，正在回滚..."
        if [ -f "${backup_dir}/play.conf.${timestamp}.bak" ]; then
            sudo cp "${backup_dir}/play.conf.${timestamp}.bak" "$server_conf"
        fi
        return 1
    fi
    
    # 启动并诊断前端服务
    if ! wait_and_diagnose_frontend; then
        error "前端服务启动失败，终止 Nginx 配置更新"
        # 清理资源
        docker-compose -f docker-compose.prod.yml down
        return 1
    fi
    
    success "Nginx 配置更新成功"
    return 0
}

# 测试部署
test_deployment() {
    log "开始测试部署..."
    local max_retries=3
    local retry=0
    
    # 1. 测试容器状态
    log "1. 测试容器状态..."
    while [ $retry -lt $max_retries ]; do
        if ! docker-compose -f docker-compose.prod.yml ps | grep -q "frontend.*Up"; then
            if [ $retry -eq $((max_retries-1)) ]; then
                error "前端容器未正常运行"
                return 1
            fi
            log "等待容器启动... ($(($retry+1))/$max_retries)"
            sleep 5
            retry=$((retry+1))
            continue
        fi
        success "前端容器运行正常"
        break
    done
    
    # 2. 测试构建
    log "2. 测试构建..."
    if ! docker-compose -f docker-compose.prod.yml logs frontend | grep -q "build completed"; then
        error "前端构建可能未完成"
        docker-compose -f docker-compose.prod.yml logs frontend
        return 1
    fi
    success "构建测试通过"
    
    # 3. 测试网络连接
    log "3. 测试网络连接..."
    if ! docker network inspect app_network >/dev/null 2>&1; then
        error "网络连接测试失败"
        return 1
    fi
    success "网络连接测试通过"
    
    # 4. 测试服务可访问性
    log "4. 测试服务可访问性..."
    retry=0
    while [ $retry -lt $max_retries ]; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:4173 | grep -q "200"; then
            success "服务可访问性测试通过"
            break
        fi
        if [ $retry -eq $((max_retries-1)) ]; then
            error "服务无法访问"
            return 1
        fi
        log "等待服务就绪... ($(($retry+1))/$max_retries)"
        sleep 5
        retry=$((retry+1))
    done
    
    # 5. 测试 Nginx 配置
    log "5. 测试 Nginx 配置..."
    if ! sudo nginx -t; then
        error "Nginx 配置测试失败"
        return 1
    fi
    success "Nginx 配置测试通过"
    
    # 6. 测试 SSL 证书
    log "6. 测试 SSL 证书..."
    if ! openssl x509 -in /etc/nginx/ssl/play.saga4v.com/fullchain.pem -noout -text >/dev/null 2>&1; then
        error "SSL 证书测试失败"
        return 1
    fi
    success "SSL 证书测试通过"
    
    success "所有测试通过！"
    return 0
}

# 清理和重建服务
clean_and_rebuild() {
    log "开始清理和重建服务..."
    
    # 1. 停止并清理所有容器和网络
    log "1. 清理所有容器和网络..."
    if ! docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans; then
        error "清理容器失败"
        return 1
    fi
    
    # 2. 清理所有未使用的资源
    log "2. 清理未使用的 Docker 资源..."
    if ! docker system prune -af --volumes; then
        error "清理 Docker 系统资源失败"
        return 1
    fi
    
    # 3. 重新构建镜像
    log "3. 重新构建镜像..."
    if ! docker-compose -f docker-compose.prod.yml build --no-cache; then
        error "构建镜像失败"
        return 1
    fi
    
    # 4. 启动服务
    log "4. 启动服务..."
    if ! docker-compose -f docker-compose.prod.yml up -d; then
        error "启动服务失败"
        return 1
    fi
    
    # 5. 检查服务日志
    log "5. 检查服务日志..."
    docker-compose -f docker-compose.prod.yml logs --tail=100
    
    success "清理和重建完成"
    return 0
}

# 调试部署问题
debug_deployment() {
    log "开始部署调试..."
    
    # 1. 清理所有资源
    log "1. 清理所有资源..."
    if ! docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans; then
        error "清理容器失败"
        return 1
    fi
    
    if ! docker system prune -af; then
        error "清理 Docker 系统资源失败"
        return 1
    fi
    
    # 2. 验证构建上下文
    log "2. 验证构建上下文..."
    log "当前目录文件列表："
    ls -la
    
    # 检查必要文件
    local required_files=("package.json" "Dockerfile" "docker-compose.prod.yml" ".env.production")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "缺少必要文件: $file"
            return 1
        fi
    done
    
    # 3. 构建镜像（带详细日志）
    log "3. 构建镜像（带详细日志）..."
    if ! docker-compose -f docker-compose.prod.yml build --no-cache --progress=plain frontend; then
        error "构建镜像失败"
        return 1
    fi
    
    # 4. 启动服务并实时查看日志
    log "4. 启动服务并查看日志..."
    if ! docker-compose -f docker-compose.prod.yml up --force-recreate -d; then
        error "启动服务失败"
        return 1
    fi
    
    # 显示实时日志
    log "显示容器日志..."
    docker-compose -f docker-compose.prod.yml logs -f --tail=100
    
    success "调试完成"
    return 0
}

# 部署服务
deploy_services() {
    local debug_mode=0
    
    # 检查是否有调试参数
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --debug) debug_mode=1; shift ;;
            *) shift ;;
        esac
    done
    
    # 如果是调试模式，运行调试函数
    if [ "$debug_mode" -eq 1 ]; then
        log "启动调试模式..."
        if ! debug_deployment; then
            error "调试过程中发现错误"
            return 1
        fi
        return 0
    fi
    
    log "开始部署服务..."
    
    # 首先清理和重建
    if ! clean_and_rebuild; then
        error "清理和重建失败"
        return 1
    fi
    
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
    
    # 等待并诊断前端服务
    if ! wait_and_diagnose_frontend; then
        error "前端服务启动失败"
        return 1
    fi
    
    # 检查并更新 Nginx 配置
    if ! check_and_update_nginx_conf; then
        error "Nginx 配置更新失败"
        return 1
    fi
    
    # 运行部署测试
    if ! test_deployment; then
        error "部署测试失败"
        return 1
    fi
    
    # 检查各个服务的日志
    check_container_logs "frontend"
    check_container_logs "nginx"
    
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
    
    # 检查并更新 Nginx 配置
    if ! check_and_update_nginx_conf; then
        error "Nginx 配置更新失败"
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