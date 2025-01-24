#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志函数
log() { echo -e "${GREEN}[INFO] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $1${NC}"; }

# 检查域名格式是否有效
check_domain_format() {
    local domain=$1
    if ! echo "$domain" | grep -qE '^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$'; then
        error "无效的域名格式: $domain"
        return 1
    fi
    return 0
}

# 检查并安装 Certbot
check_install_certbot() {
    log "检查 Certbot 安装状态..."
    
    if ! command -v certbot &> /dev/null; then
        warn "未检测到 Certbot，准备安装..."
        
        # 检测系统类型
        if [ -f /etc/debian_version ]; then
            log "检测到 Debian/Ubuntu 系统"
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
        elif [ -f /etc/redhat-release ]; then
            log "检测到 CentOS/RHEL 系统"
            yum install -y epel-release
            yum install -y certbot python3-certbot-nginx
        else
            error "不支持的操作系统"
            return 1
        fi
        
        # 验证安装
        if command -v certbot &> /dev/null; then
            log "Certbot 安装成功"
        else
            error "Certbot 安装失败"
            return 1
        fi
    else
        log "Certbot 已安装"
    fi
    
    return 0
}

# 申请证书
apply_cert() {
    local domain=$1
    local email=$2
    
    log "正在为 $domain 申请 SSL 证书..."
    
    # 备份现有的nginx配置（如果存在）
    if [ -f "/etc/nginx/conf.d/$domain.conf" ]; then
        local backup_file="/etc/nginx/conf.d/$domain.conf.bak.$(date +%Y%m%d_%H%M%S)"
        log "备份现有配置到: $backup_file"
        cp "/etc/nginx/conf.d/$domain.conf" "$backup_file"
    fi
    
    # 申请证书
    certbot certonly --nginx \
        --non-interactive \
        --agree-tos \
        --email "$email" \
        -d "$domain"
        
    if [ $? -eq 0 ]; then
        log "✓ $domain 证书申请成功"
        log "证书位置: /etc/letsencrypt/live/$domain/"
        log "证书文件:"
        log "  - 完整证书链: /etc/letsencrypt/live/$domain/fullchain.pem"
        log "  - 私钥: /etc/letsencrypt/live/$domain/privkey.pem"
        return 0
    else
        error "× $domain 证书申请失败"
        return 1
    fi
}

# 主函数
main() {
    clear
    log "=== SSL 证书申请工具 ==="
    log "本工具将帮助您为域名申请 Let's Encrypt SSL 证书"
    echo
    
    # 检查是否以root权限运行
    if [ "$EUID" -ne 0 ]; then
        error "请使用 root 权限运行此脚本"
        exit 1
    fi
    
    # 获取用户输入
    read -p "请输入需要申请证书的域名: " domain
    
    # 验证域名格式
    if ! check_domain_format "$domain"; then
        exit 1
    fi
    
    # 获取邮箱地址
    read -p "请输入您的邮箱地址（用于证书到期提醒）: " email
    
    # 显示确认信息
    echo
    log "请确认以下信息："
    echo "域名: $domain"
    echo "邮箱: $email"
    echo
    read -p "确认申请证书？(y/n): " confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        log "用户取消操作"
        exit 0
    fi
    
    # 检查并安装 Certbot
    check_install_certbot || {
        error "Certbot 安装失败，无法继续申请证书"
        exit 1
    }
    
    # 申请证书
    apply_cert "$domain" "$email"
    
    # 显示使用说明
    if [ $? -eq 0 ]; then
        echo
        log "=== 使用说明 ==="
        log "1. 证书有效期为90天"
        log "2. Certbot 会自动续期证书"
        log "3. 您可以在 Nginx 配置中使用以下路径："
        echo "   ssl_certificate     /etc/letsencrypt/live/$domain/fullchain.pem;"
        echo "   ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;"
    fi
}

# 执行主函数
main
exit $?