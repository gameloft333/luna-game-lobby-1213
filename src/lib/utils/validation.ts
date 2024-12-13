// 检查字符是否为中文
const isChinese = (char: string) => {
  const reg = /[\u4e00-\u9fa5]/;
  return reg.test(char);
};

// 检查是否包含特殊字符
const hasSpecialCharacters = (str: string) => {
  // 允许的字符：字母、数字、中文、空格、下划线、短横线
  const reg = /[^a-zA-Z0-9\u4e00-\u9fa5\s_-]/;
  return reg.test(str);
};

// 计算字符串的有效长度（中文字符算2个长度）
const getStringLength = (str: string) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    len += isChinese(str[i]) ? 2 : 1;
  }
  return len;
};

export const validateDisplayName = (name: string) => {
  if (!name.trim()) {
    return { error: 'Display name cannot be empty' };
  }

  if (hasSpecialCharacters(name)) {
    return { 
      error: 'Only letters, numbers, Chinese characters, spaces, underscores and hyphens are allowed'
    };
  }

  const effectiveLength = getStringLength(name);
  const maxLength = 12; // 最大12个英文字符或6个中文字符

  if (effectiveLength > maxLength) {
    return { error: 'Name is too long (max 6 Chinese or 12 English characters)' };
  }

  return { error: null };
};