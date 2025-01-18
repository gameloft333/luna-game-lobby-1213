import { db } from '../../lib/firebase/admin';

export default async function handler(req, res) {
  const { order_id } = req.query;

  try {
    const orderDoc = await db.collection('orders').doc(order_id).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    return res.json({ status: orderData.status });

  } catch (error) {
    console.error('Error checking payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 