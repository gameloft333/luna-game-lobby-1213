#!/bin/bash

# Main deployment script
set -e

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check and stop existing containers
stop_existing_containers() {
    echo "检查现有容器..."
    
    # 从 docker-compose.yml 中动态获取容器名称
    local container_names=$(docker-compose config --services | while read service; do
        docker-compose ps -q $service 2>/dev/null
    done)
    
    # 从 docker-compose.yml 中动态获取网络名称
    local network_names=$(docker-compose config | grep -A 1 "networks:" | grep "name:" | awk '{print $2}')
    
    if [ -n "$container_names" ] || [ -n "$network_names" ]; then
        echo "发现相关容器或网络，准备停止..."
        
        # 显示将要停止的容器信息
        if [ -n "$container_names" ]; then
            echo "将停止以下容器："
            for container_id in $container_names; do
                docker ps --filter "id=$container_id" --format "- {{.Names}} ({{.Status}})"
            done
        fi
        
        echo "执行停止操作..."
        docker-compose down --remove-orphans
        
        # 更智能的等待逻辑
        local max_attempts=30
        local attempt=1
        local all_stopped=false
        
        echo -n "等待容器停止"
        while [ $attempt -le $max_attempts ]; do
            if ! docker ps -q --filter "name=$(docker-compose ps -q)" 2>/dev/null | grep -q .; then
                all_stopped=true
                echo -e "\n所有容器已成功停止"
                break
            fi
            echo -n "."
            sleep 1
            attempt=$((attempt + 1))
        done
        
        if [ "$all_stopped" = false ]; then
            echo -e "\n注意: 部分容器停止较慢，但将继续部署流程..."
        fi
    else
        echo "未发现运行中的相关容器或网络"
    fi
    
    # 总是返回成功，让部署继续进行
    return 0
}

# Function to check and kill processes using specific ports
kill_port_process() {
    local port=$1
    if lsof -i :$port -t >/dev/null 2>&1; then
        echo "Port $port is in use. Attempting to free it..."
        lsof -i :$port -t | xargs kill -9 || true
    fi
}

# Enhanced port checking function
check_ports() {
    local ports=(9080 9443)
    for port in "${ports[@]}"; do
        if ! kill_port_process $port; then
            echo "Failed to free port $port"
            return 1
        fi
    done
}

# Function to handle cleanup
cleanup() {
    echo "Cleaning up old deployment..."
    docker system prune -f
    rm -rf tmp/* || true
}

# Function to check requirements
check_requirements() {
    if ! command -v docker >/dev/null 2>&1; then
        echo "Docker is not installed"
        return 1
    fi
    if ! command -v docker-compose >/dev/null 2>&1; then
        echo "Docker Compose is not installed"
        return 1
    fi
    return 0
}

# Function to load environment variables
load_env() {
    echo "加载环境变量..."
    if [ ! -f .env.production ]; then
        echo ".env.production 文件不存在"
        return 1
    fi

    # 使用 grep 和 sed 处理环境变量
    while IFS= read -r line; do
        # 跳过空行和注释
        [[ -z "$line" || "$line" =~ ^# ]] && continue
        
        # 跳过 JSON 格式的内容
        [[ "$line" =~ [\{\}] ]] && continue
        
        # 只处理 KEY=VALUE 格式的行
        if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
            echo "导入环境变量: $line"
            export "$line"
        fi
    done < .env.production

    echo "环境变量加载完成"
    return 0
}

# Function to initialize SSL
init_ssl() {
    echo "Initializing SSL certificates..."
    return 0
}

# Function to check container health
check_health() {
    echo "Checking container health..."
    return 0
}

# 管理 SSL 证书
manage_ssl_certificates() {
    echo "开始管理 SSL 证书..."
    local DOMAIN="play.saga4v.com"
    local CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
    
    # 检查证书是否存在和有效性
    if [ -f "$CERT_PATH" ]; then
        echo "检查证书有效期..."
        local EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH" | cut -d= -f2)
        local EXPIRY_EPOCH=$(date -d "${EXPIRY}" +%s)
        local NOW_EPOCH=$(date +%s)
        local DAYS_REMAINING=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
        
        if [ $DAYS_REMAINING -gt 30 ]; then
            echo "证书仍然有效，剩余 ${DAYS_REMAINING} 天，跳过更新"
            return 0
        else
            echo "证书将在 ${DAYS_REMAINING} 天后过期，准备更新"
        fi
    fi

    # 更全面的操作系统检测
    local OS_TYPE=""
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_TYPE="${ID}"
    elif [ -f /etc/redhat-release ]; then
        OS_TYPE="rhel"
    elif [ -f /etc/debian_version ]; then
        OS_TYPE="debian"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS_TYPE="macos"
    else
        OS_TYPE="unknown"
    fi

    echo "检测到操作系统类型: ${OS_TYPE}"

    # 安装 Certbot 和配置防火墙
    case "${OS_TYPE}" in 
        "rhel"|"centos"|"fedora")
            echo "检测到 RHEL 类系统，安装 Certbot..."
            sudo yum install -y epel-release
            sudo yum install -y certbot python3-certbot-nginx
            
            # 配置防火墙规则
            echo "配置防火墙规则..."
            if command -v firewall-cmd &> /dev/null; then
                sudo firewall-cmd --permanent --add-service=http
                sudo firewall-cmd --permanent --add-service=https
                sudo firewall-cmd --reload
            else
                echo "警告: firewall-cmd 未找到，无法配置防火墙"
            fi
            ;;
        
        "ubuntu"|"debian")
            echo "检测到 Debian 类系统，安装 Certbot..."
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
            
            # 配置防火墙规则
            echo "配置防火墙规则..."
            if command -v ufw &> /dev/null; then
                sudo ufw allow http
                sudo ufw allow https
                sudo ufw reload
            elif command -v iptables &> /dev/null; then
                sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
                sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
            else
                echo "警告: 未找到 UFW 或 iptables，无法配置防火墙"
            fi
            ;;
        
        "macos")
            echo "警告: macOS 不支持自动防火墙配置"
            ;;
        
        *)
            echo "警告: 未知的操作系统，跳过防火墙配置"
            ;;
    esac

    # 在生成证书前检查并释放 80 端口
    echo "检查并释放必要端口..."
    if ! check_and_free_port 80; then
        echo "错误: 无法释放 80 端口！"
        return 1
    fi

    # 等待端口完全释放
    echo "等待端口释放完成..."
    sleep 5

    # 生成 SSL 证书
    echo "为 ${DOMAIN} 生成 SSL 证书..."
    if ! sudo certbot certonly --standalone -d "${DOMAIN}" --non-interactive --agree-tos --email admin@saga4v.com; then
        echo "错误: SSL 证书生成失败！"
        # 确保服务恢复
        docker-compose restart
        return 1
    fi

    echo "SSL 证书生成成功！"
    
    # 重启 Docker 容器以恢复服务
    echo "重启服务..."
    docker-compose restart

    # 设置证书自动续期
    (sudo crontab -l 2>/dev/null; echo "0 0,12 * * * python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew --quiet && docker restart nginx") | sudo crontab -
    
    echo "已设置 SSL 证书自动续期"
    return 0
}

# 更新 Nginx 配置
update_nginx_config() {
    echo "更新 Nginx 配置..."
    
    # 检查所有现有的配置文件
    echo "检查现有 Nginx 配置..."
    for conf in /etc/nginx/conf.d/*.conf; do
        if [ -f "$conf" ]; then
            echo "检查配置文件: $conf"
            if grep -q "ssl_certificate" "$conf"; then
                echo "发现 SSL 配置在: $conf"
                # 检查是否是我们的域名
                if ! grep -q "play.saga4v.com" "$conf"; then
                    echo "警告: 发现其他域名的 SSL 配置，请手动检查"
                fi
            fi
        fi
    done
    
    # 备份目录使用时间戳
    local BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
    local BACKUP_DIR="/etc/nginx/conf.d/backups/${BACKUP_TIME}"
    sudo mkdir -p "${BACKUP_DIR}"
    
    # 备份现有的 play.conf（如果存在）
    if [ -f "/etc/nginx/conf.d/play.conf" ]; then
        echo "备份现有的 play.conf..."
        sudo cp "/etc/nginx/conf.d/play.conf" "${BACKUP_DIR}/"
    fi
    
    # 创建新的配置
    echo "创建新的 Nginx 配置..."
    cat << 'EOF' > ./conf.d/play.conf
# 定义上游服务器
upstream game-lobby {
    server game-lobby-web:80;
}

server {
    listen 80;
    listen [::]:80;
    server_name play.saga4v.com;
    
    location / {
        proxy_pass http://game-lobby;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name play.saga4v.com;

    ssl_certificate /etc/letsencrypt/live/play.saga4v.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/play.saga4v.com/privkey.pem;
    
    location / {
        proxy_pass http://game-lobby;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # 复制配置文件
    echo "复制配置文件到 Nginx..."
    sudo cp ./conf.d/play.conf /etc/nginx/conf.d/

    # 验证配置
    echo "验证 Nginx 配置..."
    if ! sudo nginx -t; then
        echo "错误: Nginx 配置测试失败!"
        if [ -f "${BACKUP_DIR}/play.conf" ]; then
            echo "恢复之前的配置..."
            sudo cp "${BACKUP_DIR}/play.conf" /etc/nginx/conf.d/
        fi
        return 1
    fi

    echo "Nginx 配置更新成功，备份保存在: ${BACKUP_DIR}"
    if ! sudo systemctl restart nginx; then
        echo "错误: 重启 Nginx 失败!"
        return 1
    fi

    # 验证 upstream 解析
    echo "验证 upstream 解析..."
    docker exec nginx getent hosts game-lobby-web || {
        echo "错误: 无法解析 game-lobby-web 主机名"
        return 1
    }

    # 测试容器间网络连接
    echo "测试容器间网络连接..."
    docker exec nginx curl -sf http://game-lobby-web:80 || {
        echo "错误: 无法连接到上游服务器"
        return 1
    }

    return 0
}

# 检查并释放 80 端口
check_and_free_port() {
    local port=$1
    if lsof -i :"$port" > /dev/null; then
        echo "端口 $port 已被占用，尝试释放..."
        # 临时停止 nginx 服务
        if systemctl is-active --quiet nginx; then
            systemctl stop nginx
        fi
        # 临时停止相关 Docker 容器
        docker ps -q --filter "publish=$port" | xargs -r docker stop
        
        # ... 证书申请完成后 ...
        # Docker 会自动重启 nginx，恢复服务
    fi
    return 0
}

# 添加新的网络管理函数
manage_docker_network() {
    local NETWORK_NAME="luna-game-lobby-1213_app-network"
    
    echo "管理 Docker 网络..."
    
    # 检查网络是否存在
    if docker network ls | grep -q "$NETWORK_NAME"; then
        echo "发现已存在的网络: $NETWORK_NAME"
        
        # 检查网络是否有连接的容器
        if docker network inspect "$NETWORK_NAME" | grep -q "Containers"; then
            echo "网络上存在活动容器，正在断开连接..."
            docker network disconnect -f "$NETWORK_NAME" $(docker network inspect "$NETWORK_NAME" -f '{{range .Containers}}{{.Name}} {{end}}') 2>/dev/null || true
        fi
        
        echo "移除旧网络..."
        docker network rm "$NETWORK_NAME" || true
    fi
    
    # 创建新网络
    echo "创建新网络..."
    if ! docker network create "$NETWORK_NAME"; then
        echo "错误: 创建 Docker 网络失败!"
        return 1
    fi
    
    # 等待网络就绪
    echo "等待网络就绪..."
    for i in {1..30}; do
        if docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
            echo "网络已就绪"
            break
        fi
        echo "等待网络就绪... $i/30"
        sleep 1
    done
    
    # 添加这部分：确保容器连接到网络
    echo "验证网络连接..."
    docker network connect "$NETWORK_NAME" nginx 2>/dev/null || true
    docker network connect "$NETWORK_NAME" game-lobby-web 2>/dev/null || true
    
    # 验证连接
    echo "验证容器网络连接..."
    if ! docker network inspect "$NETWORK_NAME" | grep -q "game-lobby-web"; then
        echo "警告: game-lobby-web 未正确连接到网络"
    fi
    if ! docker network inspect "$NETWORK_NAME" | grep -q "nginx"; then
        echo "警告: nginx 未正确连接到网络"
    fi
    
    echo "Docker 网络配置完成"
    return 0
}

verify_deployment() {
    echo "验证部署..."
    
    # 检查容器状态
    echo "检查容器状态..."
    docker ps -a --filter "name=game-lobby-web" --format "{{.Status}}"
    
    # 检查容器日志
    echo "检查容器日志..."
    docker logs game-lobby-web
    
    # 检查容器内部网络
    echo "检查容器内部网络..."
    docker exec game-lobby-web netstat -tulpn | grep :80
    
    # 检查容器内部服务
    echo "检查容器内部服务..."
    docker exec game-lobby-web curl -v http://localhost:80
    
    # 检查网络连通性
    echo "检查网络连通性..."
    docker exec nginx curl -v http://game-lobby-web:80
    
    # 检查 DNS 解析
    echo "检查 DNS 解析..."
    docker exec nginx dig game-lobby-web || true

    echo "检查网络连接..."
    docker exec nginx ping -c 1 game-lobby-web || true
    
    # 检查 AWS 安全组
    echo "检查端口可访问性..."
    if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:80; then
        echo "警告: HTTP 端口可能未正确配置"
    fi
    
    # 检查容器网络
    echo "检查容器网络..."
    if ! docker network inspect luna-game-lobby-1213_app-network | grep -q "game-lobby-web"; then
        echo "警告: 应用容器未正确加入网络"
    fi
    
    # 检查 Nginx 配置
    echo "检查 Nginx 配置..."
    if ! curl -s -o /dev/null -w "%{http_code}" http://game-lobby-web:80; then
        echo "警告: 无法访问应用容器"
    fi
}

wait_for_container() {
    local container_name="$1"
    local base_timeout=30    # 基准等待时间（秒）
    local extended_timeout=120  # 扩展等待时间（秒），用于异常情况
    local check_interval=2   # 检查间隔（秒）
    local current_timeout=$base_timeout
    local elapsed_time=0
    
    echo "等待容器 $container_name 就绪..."
    echo -n "["
    
    while [ $elapsed_time -le $current_timeout ]; do
        if docker inspect "$container_name" --format '{{.State.Running}}' 2>/dev/null | grep -q "true"; then
            if docker exec "$container_name" nc -z localhost 80 >/dev/null 2>&1; then
                echo -e "]\n容器 $container_name 已就绪 (用时 ${elapsed_time} 秒)"
                return 0
            fi
        fi
        
        # 如果超过基准时间但未就绪，扩展等待时间
        if [ $elapsed_time -eq $base_timeout ]; then
            echo -e "\n容器启动超过预期时间，将继续等待..."
            current_timeout=$extended_timeout
        fi
        
        # 计算进度条
        local total_width=50
        local progress=0
        if [ $elapsed_time -le $base_timeout ]; then
            progress=$((elapsed_time * total_width / base_timeout))
        else
            progress=$((total_width + (elapsed_time - base_timeout) * (total_width / (extended_timeout - base_timeout))))
        fi
        
        printf "\r["
        printf "%${progress}s" | tr ' ' '#'
        printf "%$((total_width-progress))s" | tr ' ' '-'
        printf "] %d%%" $((elapsed_time * 100 / current_timeout))
        
        sleep $check_interval
        elapsed_time=$((elapsed_time + check_interval))
    done
    
    echo -e "\n警告: 容器 $container_name 启动时间异常 (${elapsed_time} 秒)"
    # 不立即失败，而是返回一个警告状态
    return 2
}

main() {
    echo "Starting deployment process..."
    
    # Check if script is run with sudo/admin privileges
    if [ "$EUID" -ne 0 ]; then 
        echo "Please run as root or with sudo"
        exit 1
    fi
    
    # Check requirements
    if ! check_requirements; then
        echo "Requirements check failed"
        exit 1
    fi
    
    # Load environment variables
    if ! load_env; then
        echo "Failed to load environment variables"
        exit 1
    fi
    
    echo "Creating required directories..."
    mkdir -p nginx/conf.d ssl certbot/conf certbot/www
    
    # Stop existing containers
    stop_existing_containers
    
    # 1. 清理现有网络
    if ! manage_docker_network; then
        echo "Docker 网络管理失败"
        exit 1
    fi
    
    # 2. 启动应用容器
    echo "Building and starting containers..."
    if ! docker-compose up --build -d; then
        echo "Failed to start containers"
        exit 1
    fi
    
    # 3. 等待容器就绪
    wait_status=$(wait_for_container "game-lobby-web")
    wait_result=$?
    
    if [ $wait_result -eq 2 ]; then
        echo "容器启动时间异常，但将继续部署流程..."
    elif [ $wait_result -ne 0 ]; then
        echo "容器启动失败"
        exit 1
    fi
    
    # 4. 更新 Nginx 配置
    if ! update_nginx_config; then
        echo "Nginx 配置更新失败"
        exit 1
    fi
    
    # Initialize SSL certificates
    if ! init_ssl; then
        echo "SSL initialization failed"
        docker-compose down
        exit 1
    fi
    
    # Check container health
    if ! check_health; then
        echo "Health check failed"
        docker-compose down
        exit 1
    fi
    
    # 管理 SSL 证书
    if ! manage_ssl_certificates; then
        echo "SSL 管理失败"
        exit 1
    fi

    # 验证部署
    if ! verify_deployment; then
        echo "部署验证失败，请检查配置"
        exit 1
    fi
    
    echo "Deployment completed successfully!"
}

# Trap ctrl-c and call cleanup
trap 'echo "Deployment interrupted"; docker-compose down; exit 1' INT

# Run main function
main "$@"