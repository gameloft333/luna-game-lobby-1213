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

# 检查并安装 Certbot
check_install_certbot() {
    log "检查 Certbot 安装状态..."
    
    if ! command -v certbot &> /dev/null; then
        warn "未检测到 Certbot，准备安装..."
        
        # 检测系统类型
        if [ -f /etc/debian_version ]; then
            # Debian/Ubuntu 系统
            log "检测到 Debian/Ubuntu 系统"
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
        elif [ -f /etc/redhat-release ]; then
            # CentOS/RHEL 系统
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

# 获取配置文件中的所有域名
get_domains() {
    # 查找 nginx_global_config 目录下最新的配置文件
    local config_dir="./nginx_global_config"
    local nginx_conf=$(ls -t "${config_dir}"/nginx.global.*.conf 2>/dev/null | head -n1)
    
    if [ -z "$nginx_conf" ]; then
        error "未找到 nginx 配置文件"
        return 1
    fi
    
    log "使用配置文件: $nginx_conf"
    
    # 改进域名提取逻辑，使用临时文件避免日志混入
    local temp_domains=$(mktemp)
    
    # 提取域名并过滤
    grep -E "^\s*server_name" "$nginx_conf" | 
    sed -e 's/server_name//g' -e 's/;//g' | 
    tr -s ' ' '\n' | 
    grep -v '^$' | 
    grep -v '_' |
    grep -v '\[' |  # 过滤掉包含方括号的行（日志输出）
    grep -E '^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$' > "$temp_domains"
    
    # 读取并显示域名
    local result=$(cat "$temp_domains" | sort -u)
    rm -f "$temp_domains"
    
    echo "$result"
}

# 检查证书状态
check_cert_status() {
    local domain=$1
    
    # 添加域名格式验证
    if ! echo "$domain" | grep -qE '^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$'; then
        error "无效的域名格式: $domain"
        return 1
    fi
    
    local cert_path="/etc/letsencrypt/live/$domain/fullchain.pem"
    
    if [ ! -f "$cert_path" ]; then
        echo "missing"
        return
    fi
    
    # 获取证书过期时间
    local expiry_date=$(openssl x509 -enddate -noout -in "$cert_path" | cut -d= -f2)
    local expiry_epoch=$(date -d "${expiry_date}" +%s)
    local now_epoch=$(date +%s)
    local days_remaining=$(( ($expiry_epoch - $now_epoch) / 86400 ))
    
    if [ $days_remaining -lt 30 ]; then
        echo "expiring"
    else
        echo "valid"
    fi
}

# 申请证书
apply_cert() {
    local domain=$1
    log "正在为 $domain 申请 SSL 证书..."
    
    # 检查并安装 Certbot
    check_install_certbot || {
        error "Certbot 安装失败，无法继续申请证书"
        return 1
    }
    
    certbot certonly --nginx \
        --non-interactive \
        --agree-tos \
        --email your-email@example.com \
        -d "$domain"
        
    if [ $? -eq 0 ]; then
        log "✓ $domain 证书申请成功"
        log "证书位置: /etc/letsencrypt/live/$domain/"
        return 0
    else
        error "× $domain 证书申请失败"
        return 1
    fi
}

# 主函数
main() {
    log "开始检查域名 SSL 证书状态..."
    
    # 获取并验证域名列表
    local domains=$(get_domains)
    if [ -z "$domains" ]; then
        error "未找到有效的域名配置"
        return 1
    fi
    
    log "找到以下域名配置:"
    echo "$domains" | while read -r domain; do
        if [ -n "$domain" ]; then
            log "- $domain"
        fi
    done
    
    # 存储需要处理的域名
    declare -A domains_to_process
    local total_domains=0
    
    # 检查所有域名的证书状态
    echo "$domains" | while read -r domain; do
        if [ -n "$domain" ]; then
            log "检查域名: $domain"
            local status=$(check_cert_status "$domain")
            case $status in
                "missing")
                    warn "域名 $domain 没有 SSL 证书"
                    domains_to_process[$domain]="missing"
                    total_domains=$((total_domains + 1))
                    ;;
                "expiring")
                    warn "域名 $domain 的 SSL 证书即将过期"
                    domains_to_process[$domain]="expiring"
                    total_domains=$((total_domains + 1))
                    ;;
                "valid")
                    log "域名 $domain 的 SSL 证书有效"
                    ;;
            esac
        fi
    done
    
    # 如果没有需要处理的域名，直接退出
    if [ $total_domains -eq 0 ]; then
        log "所有域名的 SSL 证书都是有效的"
        return 0
    fi
    
    # 显示选项菜单
    echo -e "\n请选择要执行的操作："
    local i=1
    for domain in "${!domains_to_process[@]}"; do
        local status=${domains_to_process[$domain]}
        if [ "$status" = "missing" ]; then
            echo "$i) 为 $domain 申请新的 SSL 证书"
        else
            echo "$i) 为 $domain 续期 SSL 证书"
        fi
        i=$((i + 1))
    done
    echo "$i) 退出，不进行任何操作"
    
    # 获取用户选择
    read -p "请输入选项编号（多个选项用空格分隔）: " -a choices
    
    # 处理用户选择
    for choice in "${choices[@]}"; do
        if [ "$choice" -eq "$i" ]; then
            log "用户选择退出"
            return 0
        fi
        
        local domain=$(echo "${!domains_to_process[@]}" | cut -d' ' -f$choice)
        if [ -n "$domain" ]; then
            apply_cert "$domain"
        fi
    done
    
    # 显示所有成功申请的证书位置
    log "\n证书申请完成。证书位置汇总："
    for domain in "${!domains_to_process[@]}"; do
        if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
            log "- $domain: /etc/letsencrypt/live/$domain/"
        fi
    done
}

# 执行主函数
main
exit $?