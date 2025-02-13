import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import zh from './locales/zh';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en', // 备用语言
    interpolation: {
      escapeValue: false // React 已经安全地转义
    },
    debug: true, // 启用调试模式
  })
  .then(() => {
    console.log('[DEBUG] i18n 初始化成功');
    console.log('[DEBUG] 当前语言:', i18n.language);
    console.log('[DEBUG] 可用语言:', i18n.languages);
  })
  .catch((error) => {
    console.error('[ERROR] i18n 初始化失败:', error);
  });

console.log('[DEBUG] i18n initialized with languages:', Object.keys(i18n.services.resourceStore.data));

export default i18n;