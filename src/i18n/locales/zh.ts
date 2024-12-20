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
  }
}; 