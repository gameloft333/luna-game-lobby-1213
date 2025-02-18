import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Beaker, 
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  Globe
} from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { useSettingsStore } from '../store/settings';
import { UserProfileHeader } from '../components/profile/UserProfileHeader';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/firebase/auth';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../hooks/useUserProfile';
import { TokenShop } from '../components/shop/TokenShop';

// 添加调试日志工具函数
const logDebug = (message: string, data?: any) => {
  console.log(`[DEBUG] Profile - ${message}`, data || '');
};

// 菜单项可见性配置类型
interface MenuItemConfig {
  id: string;
  envKey: string;
  defaultValue: boolean;
}

// 菜单项可见性配置
const menuVisibilityConfig: MenuItemConfig[] = [
  { id: 'notifications', envKey: 'VITE_MENU_SHOW_NOTIFICATIONS', defaultValue: true },
  { id: 'privacy', envKey: 'VITE_MENU_SHOW_PRIVACY', defaultValue: true },
  { id: 'theme', envKey: 'VITE_MENU_SHOW_THEME', defaultValue: true },
  { id: 'help', envKey: 'VITE_MENU_SHOW_HELP', defaultValue: true },
  { id: 'language', envKey: 'VITE_MENU_SHOW_LANGUAGE', defaultValue: true },
  { id: 'testMode', envKey: 'VITE_MENU_SHOW_TEST_MODE', defaultValue: false },
] as const;

// 可见性检查函数
const getMenuItemVisibility = (config: MenuItemConfig): boolean => {
  const envValue = import.meta.env[config.envKey];
  const isVisible = envValue === undefined ? config.defaultValue : envValue === 'true';
  logDebug(`Menu item ${config.id} visibility:`, isVisible);
  return isVisible;
};

// 添加隐私政策跳转函数
const handlePrivacyClick = () => {
  const baseUrl = import.meta.env.VITE_PRIVACY_POLICY_BASE_URL;
  const hash = import.meta.env.VITE_PRIVACY_POLICY_HASH;
  
  logDebug('Privacy policy config:', { baseUrl, hash });
  
  const url = hash ? `${baseUrl}/#${hash}` : baseUrl;
  logDebug('Opening privacy policy page:', url);
  
  if (baseUrl) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    console.error('[ERROR] Privacy policy URL is not configured');
  }
};

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { testMode, toggleTestMode, canAccessTestMode } = useSettingsStore();
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const [isShopOpen, setIsShopOpen] = useState(false);

  // 添加调试日志
  logDebug('VITE_ENABLE_TRANSFER:', import.meta.env.VITE_ENABLE_TRANSFER);
  logDebug('Current language:', i18n.language);
  logDebug('Rendering profile page with wallet and settings sections');

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  const baseMenuItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: t('profile.menu.notifications'),
      onClick: () => {},
      showDivider: false,
      visible: getMenuItemVisibility(menuVisibilityConfig[0])
    },
    {
      id: 'privacy',
      icon: Shield,
      label: t('profile.menu.privacySecurity'),
      onClick: handlePrivacyClick,
      showDivider: false,
      visible: getMenuItemVisibility(menuVisibilityConfig[1])
    },
    {
      id: 'theme',
      icon: theme === 'dark' ? Moon : Sun,
      label: t('profile.menu.theme'),
      onClick: toggleTheme,
      value: theme === 'dark' ? t('profile.menu.darkMode') : t('profile.menu.lightMode'),
      showDivider: false,
      visible: getMenuItemVisibility(menuVisibilityConfig[2])
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: t('profile.menu.helpSupport'),
      onClick: () => {},
      showDivider: false,
      visible: getMenuItemVisibility(menuVisibilityConfig[3])
    },
    {
      id: 'language',
      icon: Globe,
      label: t('profile.menu.language'),
      onClick: () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
      },
      value: i18n.language === 'en' ? t('profile.menu.english') : t('profile.menu.chinese'),
      showDivider: true,
      visible: getMenuItemVisibility(menuVisibilityConfig[4])
    },
    {
      id: 'signOut',
      icon: LogOut,
      label: t('profile.menu.signOut'),
      onClick: handleSignOut,
      danger: true,
      showDivider: false,
      visible: true // 登出选项始终显示
    }
  ];

  // 过滤可见的菜单项
  const menuItems = baseMenuItems.filter(item => item.visible);

  // 添加测试模式选项
  if (canAccessTestMode(user?.email)) {
    const testModeConfig = menuVisibilityConfig[5];
    if (getMenuItemVisibility(testModeConfig)) {
      menuItems.splice(-1, 0, {
        id: 'testMode',
        icon: Beaker,
        label: t('profile.menu.testMode'),
        onClick: toggleTestMode,
        isToggle: true,
        value: testMode,
        showDivider: false,
        visible: true
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Profile Header */}
      <UserProfileHeader />

      {/* Wallet Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold dark:text-white">{t('profile.wallet.title')}</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.wallet.balance')}</p>
              <p className="text-2xl font-bold dark:text-white">
                {loading ? '...' : t('profile.wallet.tokens', { amount: profile?.tokens || 0 })}
              </p>
            </div>
            <button 
              onClick={() => setIsShopOpen(true)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('shop.addFunds')}
            </button>
          </div>
          {import.meta.env.VITE_ENABLE_TRANSFER === 'true' && (
            <div className="grid grid-cols-2 gap-4">
              {/* Transfer Button - 临时隐藏，将在未来版本启用 */}
              <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="block text-sm text-gray-600 dark:text-gray-400">{t('profile.wallet.send')}</span>
                <span className="block text-lg font-semibold dark:text-white">{t('profile.wallet.transfer')}</span>
              </button>
              {/* Deposit Button - 临时隐藏，将在未来版本启用 */}
              <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="block text-sm text-gray-600 dark:text-gray-400">{t('profile.wallet.receive')}</span>
                <span className="block text-lg font-semibold dark:text-white">{t('profile.wallet.deposit')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold dark:text-white">{t('profile.settings.title')}</h2>
          </div>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                onClick={item.onClick}
                className={cn(
                  "w-full px-6 py-4 flex items-center justify-between transition-colors",
                  item.danger 
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.isToggle ? (
                  <div
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      item.value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        item.value ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </div>
                ) : item.value ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.value}
                  </span>
                ) : !item.danger && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {item.showDivider && (
                <div className="h-2 bg-gray-50 dark:bg-gray-900" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <TokenShop isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}