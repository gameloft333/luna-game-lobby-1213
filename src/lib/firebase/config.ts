import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// 创建 .env.development 文件检查
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error(`
    环境变量未正确加载！
    请确保在项目根目录创建 .env.development 文件，
    并包含所有必需的环境变量。
    
    必需的环境变量：
    VITE_FIREBASE_API_KEY=你的API密钥
    VITE_FIREBASE_AUTH_DOMAIN=你的域名
    VITE_FIREBASE_PROJECT_ID=你的项目ID
    VITE_FIREBASE_STORAGE_BUCKET=你的存储桶
    VITE_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
    VITE_FIREBASE_APP_ID=你的应用ID
    VITE_FIREBASE_MEASUREMENT_ID=你的测量ID
    VITE_DOMAIN=你的域名
  `);
  throw new Error('环境变量未正确配置');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Only initialize analytics if window exists (browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// 确保启用了邮件链接验证
auth.settings = {
  ...auth.settings,
  signInWithEmailLink: true
};