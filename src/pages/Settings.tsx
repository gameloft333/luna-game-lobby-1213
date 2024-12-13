import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Beaker } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { useSettingsStore } from '../store/settings';

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();
  const { testMode, toggleTestMode } = useSettingsStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
            <div>
              <h3 className="font-medium dark:text-white">Theme</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="text-blue-600 dark:text-blue-400 text-sm"
          >
            Toggle
          </button>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Beaker className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <h3 className="font-medium dark:text-white">Test Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable test features and debugging
              </p>
            </div>
          </div>
          <button
            onClick={toggleTestMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              testMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                testMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}