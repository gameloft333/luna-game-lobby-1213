import React from 'react';
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

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { testMode, toggleTestMode, canAccessTestMode } = useSettingsStore();
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  // 检查用户是否可以访问测试模式
  const showTestMode = canAccessTestMode(user?.email);

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      onClick: () => {},
      showDivider: false
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      onClick: () => {},
      showDivider: false
    },
    {
      icon: theme === 'dark' ? Moon : Sun,
      label: 'Theme',
      onClick: toggleTheme,
      value: theme === 'dark' ? 'Dark mode' : 'Light mode',
      showDivider: false
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: () => {},
      showDivider: true
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleSignOut,
      danger: true,
      showDivider: false
    },
    {
      icon: Globe,
      label: 'Language',
      onClick: () => {
        const newLang = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
      },
      value: i18n.language === 'en' ? 'English' : '中文',
      showDivider: true
    }
  ];

  if (showTestMode) {
    menuItems.splice(-1, 0, {
      icon: Beaker,
      label: 'Test Mode',
      onClick: toggleTestMode,
      isToggle: true,
      value: testMode,
      showDivider: false
    });
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
            <h2 className="text-xl font-semibold dark:text-white">Wallet</h2>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
              <p className="text-2xl font-bold dark:text-white">1,234 Tokens</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Funds
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="block text-sm text-gray-600 dark:text-gray-400">Send</span>
              <span className="block text-lg font-semibold dark:text-white">Transfer</span>
            </button>
            <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="block text-sm text-gray-600 dark:text-gray-400">Receive</span>
              <span className="block text-lg font-semibold dark:text-white">Deposit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
          </div>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
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
    </div>
  );
}