import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../../hooks/useUserProfile';
import { cn } from '../../lib/utils';
import { useTokenPurchase } from '../../hooks/useTokenPurchase';
import { toast } from 'react-hot-toast';
import { doc, collection, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

// 商品配置，后续可以移到配置文件中
const TOKEN_PACKAGES = [
  { id: 'token_10', amount: 10, price: 0.99, bonus: 0, tag: '', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' },
  { id: 'token_50', amount: 50, price: 4.99, bonus: 5, tag: 'Popular', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' },
  { id: 'token_100', amount: 100, price: 9.99, bonus: 15, tag: '', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' },
  { id: 'token_500', amount: 500, price: 49.99, bonus: 100, tag: 'Best Value', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' },
  { id: 'token_1000', amount: 1000, price: 99.99, bonus: 250, tag: '', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' },
  { id: 'token_2000', amount: 2000, price: 199.99, bonus: 600, tag: 'Most Tokens', paymentLink: 'https://buy.stripe.com/test_00g8AacUxaNr57GdQQ' }
];

// 在 TOKEN_PACKAGES 定义后添加辅助函数
const getStripeSuccessUrl = () => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/payment-success`;
};

// 添加在 TOKEN_PACKAGES 定义后
const createStripeUrl = (baseUrl: string, pkg: typeof TOKEN_PACKAGES[0], orderId: string) => {
    const url = new URL(baseUrl);
    url.searchParams.append('client_reference_id', orderId);
    url.searchParams.append('success_url', `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`);
    url.searchParams.append('cancel_url', `${window.location.origin}/payment-cancelled`);
    return url.toString();
  }; 

interface TokenShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TokenShop({ isOpen, onClose }: TokenShopProps) {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const { handlePurchaseSuccess } = useTokenPurchase();

  const handlePurchase = async (pkg: typeof TOKEN_PACKAGES[0]) => {
    console.log('Starting purchase process for package:', pkg);
    
    if (!profile?.uid) {
      toast.error(t('errors.loginRequired'));
      return;
    }

    try {
      // 创建订单记录
      const orderRef = doc(collection(db, 'orders'));
      await setDoc(orderRef, {
        uid: profile.uid,
        orderId: orderRef.id,
        packageId: pkg.id,
        amount: pkg.amount,
        bonus: pkg.bonus,
        price: pkg.price,
        status: 'pending',
        createdAt: serverTimestamp(),
        email: profile.email
      });

      // 在创建订单后，添加状态检查
      const checkPaymentStatus = async () => {
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists() && orderDoc.data().status === 'completed') {
          clearInterval(checkInterval);
          await handlePurchaseSuccess({
            amount: pkg.amount,
            bonus: pkg.bonus,
            orderId: orderRef.id
          });
        }
      };

      // 每5秒检查一次支付状态
      const checkInterval = setInterval(checkPaymentStatus, 5000);

      // 5分钟后停止检查
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 300000);

      // 继续执行原有的支付流程
      window.open(pkg.paymentLink, '_blank');

    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(t('shop.purchase.failed'));
    }
  };

  // 在组件内添加一个点击处理函数
  const handlePackageClick = (pkg: typeof TOKEN_PACKAGES[0]) => {
    console.log('Package clicked:', pkg);
    
    // 添加按钮点击反馈
    toast.loading('正在处理支付...', {
      duration: 2000,
    });
    
    // 延迟执行购买操作，确保 toast 显示
    setTimeout(() => {
      handlePurchase(pkg).catch(error => {
        console.error('Purchase failed:', error);
        toast.error('支付处理失败，请重试');
      });
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                     md:w-[800px] md:h-[85vh] bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden
                     border border-white/10"
          >
            {/* 头部背景 */}
            <div className="absolute inset-0 bg-[url('/images/shop-bg.jpg')] bg-cover bg-center opacity-10" />
            
            {/* 头部内容 */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 p-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10"
              />
              
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  {t('shop.title')}
                </h2>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl py-3 px-4 w-fit">
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <span className="text-lg text-white font-medium">
                    {t('shop.currentBalance', { amount: profile?.tokens || 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 商品列表 */}
            <div className="p-8 overflow-auto" style={{ maxHeight: 'calc(85vh - 192px)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TOKEN_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageClick(pkg)}
                    className="relative flex flex-col items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 
                               transition-colors border border-white/10 group cursor-pointer"
                  >
                    {pkg.tag && (
                      <span className="absolute -top-3 right-4 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        {pkg.tag}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 
                                    flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/20">
                          <Coins className="w-10 h-10 text-white" />
                        </div>
                        {pkg.bonus > 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 
                                      flex items-center justify-center">
                            <Gift className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {t('shop.packages.tokens', { amount: pkg.amount })}
                          </h3>
                          <span className="text-2xl font-bold text-blue-400">
                            ${pkg.price}
                          </span>
                        </div>
                        {pkg.bonus > 0 && (
                          <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                            <Gift className="w-4 h-4" />
                            {t('shop.packages.bonus', { amount: pkg.bonus })}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 