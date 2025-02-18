export default {
  auth: {
    emailLink: {
      title: '邮箱链接登录',
      verifying: '正在验证登录链接...',
      success: '登录成功！正在跳转...',
      invalid: '无效或已过期的登录链接',
      error: '处理登录链接时出错',
      requestNew: '请重新请求登录链接',
      emailLabel: '邮箱地址',
      emailPlaceholder: '请输入您的邮箱',
      sendLink: '发送登录链接',
      linkSent: '登录链接已发送至 {{email}}。请检查您的邮箱并点击链接登录。',
      sendAnother: '重新发送链接',
      useEmailLink: '使用邮箱链接验证',
      enterEmail: '请提供您的注册邮箱以确认'
    },
    errors: {
      invalidEmail: '无效的邮箱地址',
      emailExists: '该邮箱已注册，请直接登录',
      notEnabled: '邮箱链接登录未启用',
      tooManyRequests: '请求过于频繁，请稍后重试',
      default: '发生意外错误',
      googleSignIn: {
        default: '使用谷歌登录失败',
        popupBlocked: '弹窗被阻止，请允许本站弹窗后重试',
        cancelled: '登录已取消，请重试',
        unauthorizedDomain: '此域名未授权使用谷歌登录，请使用邮箱登录',
        popupClosed: '登录窗口已关闭，请重试',
        generic: '谷歌登录失败，请稍后重试'
      },
      signIn: {
        invalidCredentials: '邮箱或密码错误',
        userNotFound: '未找到该邮箱账号',
        tooManyAttempts: '登录尝试次数过多，请稍后重试',
        default: '登录失败'
      },
      signUp: {
        emailInUse: '该邮箱已被注册',
        weakPassword: '密码长度至少需要6个字符',
        default: '创建账号失败'
      },
      dynamicLinkNotActivated: '邮箱验证链接未正确配置，请联系管理员'
    },
    createAccount: {
      title: '创建您的账号',
      subtitle: '登录后即可访问此功能',
      browsing: '您仍可以在不登录的情况下浏览游戏',
      emailAddress: '邮箱地址',
      sendSignInLink: '发送登录链接',
      alreadyHaveAccount: '已有账号？',
      signIn: '登录'
    }
  },
  home: {
    featuredGames: '精选游戏',
    dailyCheckin: '每日签到'
  },
  errors: {
    loadDataFailed: '加载数据失败',
    claimFailed: '领取奖励失败'
  },
  rewards: {
    claimed: '奖励领取成功'
  },
  shop: {
    title: '代币商店',
    currentBalance: '当前余额：{{amount}} 代币',
    addFunds: '充值',
    packages: {
      bonus: '+{{amount}} 赠送',
      tokens: '{{amount}} 代币'
    },
    purchase: {
      success: '购买成功',
      failed: '购买失败',
      processing: '正在处理支付...'
    }
  },
  games: {
    zen: {
      title: '颜色呼吸疗愈',
      description: '通过AI驱动的呼吸引导和冥想音乐，帮助您缓解压力，找到内心的平静'
    },
    mood: {
      title: '情绪跟踪管理',
      description: '智能情绪追踪助手，记录和分析您的日常情绪变化'
    },
    bible: {
      title: 'AI圣经助手',
      description: '智能圣经解读助手，提供个性化的灵修指导'
    },
    cryptoQuest: {
      title: '加密探险',
      description: '踏上区块链世界的史诗冒险之旅'
    },
    nftLegends: {
      title: 'NFT传奇',
      description: '收集、交易和对战独特的NFT角色'
    },
    metaRacer: {
      title: '元宇宙赛车',
      description: '体验元宇宙中的高速竞速'
    },
    aiChess: {
      title: 'AI国际象棋大师',
      description: '在战略对弈中挑战高级AI'
    },
    aiCompanions: {
      title: 'AI伴侣',
      description: '与AI伴侣建立有意义的情感连接'
    },
    kittySpin: {
      title: '喵喵转盘',
      description: '可爱的猫咪主题游戏，转动转盘赢取奖励！'
    }
  },
  profile: {
    menu: {
      notifications: '通知',
      privacySecurity: '隐私与安全',
      theme: '主题',
      darkMode: '深色模式',
      lightMode: '浅色模式',
      helpSupport: '帮助与支持',
      signOut: '退出登录',
      language: '语言',
      english: 'English',
      chinese: '中文',
      testMode: '测试模式'
    },
    wallet: {
      title: '钱包',
      balance: '余额',
      tokens: '{{amount}} 代币',
      send: '发送',
      receive: '接收',
      transfer: '转账',
      deposit: '存款'
    },
    settings: {
      title: '设置'
    }
  }
}; 