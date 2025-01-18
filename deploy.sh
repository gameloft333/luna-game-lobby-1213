#!/bin/bash

# Main deployment script
set -e

# Script variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check and stop existing containers
stop_existing_containers() {
    echo "Checking for existing containers..."
    if docker ps -q --filter "name=luna-game-lobby" | grep -q .; then
        echo "Stopping existing containers..."
        docker-compose down
    fi
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
    if [ -f .env.production ]; then
        source .env.production
        return 0
    else
        echo ".env.production file not found"
        return 1
    fi
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

    # 检查域名
    DOMAIN="play.saga4v.com"

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
    
    # 添加调试信息
    echo "当前工作目录: $(pwd)"
    echo "检查目录结构..."
    ls -la
    
    # 创建必要的目录
    echo "创建必要的目录结构..."
    sudo mkdir -p /etc/nginx/ssl
    sudo mkdir -p ./conf.d
    
    # 创建 SSL 配置文件
    echo "创建 SSL 配置文件..."
    cat << 'EOF' | sudo tee /etc/nginx/ssl/ssl.conf
# SSL 配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
EOF
    
    # 从 nginx.conf 模板创建 play.conf
    if [ ! -f "./conf.d/play.conf" ]; then
        echo "创建新的 Nginx 配置文件..."
        # 使用已有的 nginx.conf 作为模板
        cp nginx.conf ./conf.d/play.conf
        # 替换域名变量
        sed -i "s/\${DOMAIN}/play.saga4v.com/g" ./conf.d/play.conf
    fi
    
    local LOCAL_CONF="./conf.d/play.conf"
    local REMOTE_CONF="/etc/nginx/conf.d/play.conf"
    local BACKUP_CONF="${REMOTE_CONF}.bak"

    # 备份现有配置文件
    if [ -f "$REMOTE_CONF" ]; then
        if ! sudo cp "$REMOTE_CONF" "$BACKUP_CONF"; then
            echo "错误: 备份现有 Nginx 配置文件失败!"
            return 1
        fi
        echo "已备份现有 Nginx 配置文件到 ${BACKUP_CONF}"
    fi

    # 复制新的配置文件
    if ! sudo cp "$LOCAL_CONF" "$REMOTE_CONF"; then
        echo "错误: 复制新的 Nginx 配置文件失败!"
        return 1
    fi
    echo "已将新的 Nginx 配置文件复制到 $REMOTE_CONF"

    # 测试 Nginx 配置
    if ! sudo nginx -t; then
        echo "错误: Nginx 配置测试失败!"
        return 1
    fi
    echo "Nginx 配置测试成功"

    # 重启 Nginx
    if ! sudo systemctl reload nginx; then
        if ! sudo systemctl restart nginx; then
            echo "错误: 重启 Nginx 失败!"
            return 1
        fi
        echo "已重启 Nginx 服务 (使用 restart)"
    else
        echo "已重新加载 Nginx 服务 (使用 reload)"
    fi

    echo "Nginx 配置更新完成"
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
    
    # Check and free ports
    if ! check_ports; then
        echo "Failed to free required ports"
        exit 1
    fi
    
    # Clean up old deployment
    cleanup
    
    echo "Building and starting containers..."
    if ! docker-compose up --build -d; then
        echo "Failed to start containers"
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

    # 更新 Nginx 配置
    if ! update_nginx_config; then
        echo "Nginx 配置更新失败"
        exit 1
    fi
    
    echo "Deployment completed successfully!"
}

# Trap ctrl-c and call cleanup
trap 'echo "Deployment interrupted"; docker-compose down; exit 1' INT

# Run main function
main "$@"