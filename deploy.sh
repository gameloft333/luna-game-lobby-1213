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
    
    # 检查并创建 Docker 网络
    echo "检查 Docker 网络..."
    local NETWORK_NAME="luna-game-lobby-1213_app-network"
    if ! docker network ls | grep -q "$NETWORK_NAME"; then
        echo "创建 Docker 网络: $NETWORK_NAME"
        if ! docker network create "$NETWORK_NAME"; then
            echo "错误: 创建 Docker 网络失败!"
            return 1
        fi
    fi

    # 检查证书文件是否存在
    echo "检查证书文件..."
    if [ ! -d "/etc/letsencrypt/live/play.saga4v.com" ]; then
        echo "错误: SSL 证书目录不存在!"
        echo "证书路径: /etc/letsencrypt/live/play.saga4v.com"
        ls -la /etc/letsencrypt/live/ || true
        return 1
    fi

    # 创建必要的目录
    echo "创建必要的目录结构..."
    sudo mkdir -p /etc/nginx/ssl
    sudo mkdir -p ./conf.d
    sudo mkdir -p ./backups/$(date +%Y%m%d_%H%M%S)
    
    local BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    
    # 备份和复制证书文件
    echo "处理证书文件..."
    [ -f "/etc/nginx/ssl/play.saga4v.com.crt" ] && sudo cp "/etc/nginx/ssl/play.saga4v.com.crt" "$BACKUP_DIR/"
    [ -f "/etc/nginx/ssl/play.saga4v.com.key" ] && sudo cp "/etc/nginx/ssl/play.saga4v.com.key" "$BACKUP_DIR/"
    
    sudo cp /etc/letsencrypt/live/play.saga4v.com/fullchain.pem /etc/nginx/ssl/play.saga4v.com.crt
    sudo cp /etc/letsencrypt/live/play.saga4v.com/privkey.pem /etc/nginx/ssl/play.saga4v.com.key
    
    # 创建新的 nginx 配置
    echo "创建新的 Nginx 配置..."
    cat << EOF > ./conf.d/play.conf
server {
    listen 9080;
    listen [::]:9080;
    server_name play.saga4v.com;
    
    # HTTP 重定向到 HTTPS
    location / {
        return 301 https://\$host:\$server_port\$request_uri;
    }
}

server {
    listen 9443 ssl;
    listen [::]:9443 ssl;
    server_name play.saga4v.com;

    ssl_certificate /etc/nginx/ssl/play.saga4v.com.crt;
    ssl_certificate_key /etc/nginx/ssl/play.saga4v.com.key;
    include /etc/nginx/ssl/ssl.conf;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # 添加 API 代理配置
    location /api/webhook/stripe {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # 复制配置文件到 Nginx 配置目录
    [ -f "/etc/nginx/conf.d/play.conf" ] && sudo cp "/etc/nginx/conf.d/play.conf" "$BACKUP_DIR/"
    sudo cp ./conf.d/play.conf /etc/nginx/conf.d/

    # 检查 Nginx 配置
    echo "检查 Nginx 配置..."
    if ! sudo nginx -t; then
        echo "错误: Nginx 配置测试失败!"
        return 1
    fi

    # 重启 Docker 容器前确保网络存在
    echo "重启 Docker 服务..."
    if ! docker network ls | grep -q "$NETWORK_NAME"; then
        echo "错误: Docker 网络不存在，重新创建..."
        docker network create "$NETWORK_NAME"
    fi
    
    # 停止并删除现有容器
    docker-compose down --remove-orphans
    
    # 启动新容器
    docker-compose up -d

    echo "Nginx 配置更新完成，备份文件保存在: $BACKUP_DIR"
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