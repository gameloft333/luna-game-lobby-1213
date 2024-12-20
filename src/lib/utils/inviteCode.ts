// 将 UID 转换为短邀请码
export function generateInviteCode(uid: string): string {
  // 取 UID 的前8位作为基础
  const base = uid.slice(0, 8);
  // 添加校验和以确保有效性
  const checksum = generateChecksum(base);
  return `${base}${checksum}`;
}

// 验证邀请码是否有效
export function validateInviteCode(code: string): boolean {
  if (!code || code.length !== 9) return false;
  const base = code.slice(0, 8);
  const checksum = code.slice(8);
  return checksum === generateChecksum(base);
}

// 从邀请码提取原始 UID
export function extractUidFromCode(code: string): string | null {
  if (!validateInviteCode(code)) return null;
  return code.slice(0, 8);
}

// 生成简单的校验和
function generateChecksum(str: string): string {
  return str.split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .slice(-1);
}