import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [messageSent, setMessageSent] = useState(false);
  
  useEffect(() => {
    const order_id = searchParams.get('order_id');
    
    if (order_id && !messageSent) {
      try {
        if (!window.opener) {
          console.error('No parent window found');
          return;
        }

        console.log('Sending payment success message for order:', order_id);
        
        const sendMessage = () => {
          window.opener.postMessage({
            type: 'stripe-payment-success',
            order_id,
            timestamp: new Date().getTime()
          }, window.location.origin);
          
          console.log('Message sent to:', window.location.origin);
          setMessageSent(true);
        };

        // 立即发送一次
        sendMessage();
        
        // 确保消息被接收
        const messageInterval = setInterval(() => {
          if (!messageSent) {
            sendMessage();
          }
        }, 1000);

        // 10秒后关闭窗口
        const closeTimeout = setTimeout(() => {
          window.close();
        }, 10000);

        return () => {
          clearInterval(messageInterval);
          clearTimeout(closeTimeout);
        };

      } catch (error) {
        console.error('Error sending success message:', error);
      }
    }
  }, [searchParams, messageSent]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-4 text-green-500">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          支付成功！
        </h1>
        <p className="text-gray-600">
          正在处理您的购买...
        </p>
      </div>
    </div>
  );
} 