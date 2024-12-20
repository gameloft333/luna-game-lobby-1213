export function WalletBalance() {
  const { profile, loading } = useUserProfile();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {t('wallet.balance')}
      </h3>
      <div className="mt-2 text-3xl font-bold">
        {loading ? '...' : `${profile?.tokens || 0} Tokens`}
      </div>
    </div>
  );
} 