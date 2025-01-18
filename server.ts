import express from 'express';
import bodyParser from 'body-parser';
import { stripe } from './lib/stripe.js';
import { db } from './lib/firebase/admin.js';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001;

// Middleware to parse raw body for Stripe webhook
app.use('/api/webhook/stripe', bodyParser.raw({type: 'application/json'}));

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'stripe-webhook-logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function logWebhookEvent(event: any) {
  const logFileName = `${new Date().toISOString().split('T')[0]}-stripe-webhooks.log`;
  const logFilePath = path.join(logsDir, logFileName);
  
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    type: event.type,
    id: event.id,
    data: event.data.object
  }) + '\n';

  fs.appendFileSync(logFilePath, logEntry);
}

async function updateUserTokens(userId: string, amount: number) {
  try {
    if (!userId) {
      console.error('No user ID provided for token update');
      return;
    }

    const userRef = db.collection('users').doc(userId);
    
    // First, check if the user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.error(`User not found: ${userId}`);
      return;
    }

    // Get current user data
    const userData = userDoc.data();
    const currentTokens = userData?.tokens || 0;

    // Perform token update
    await userRef.update({
      tokens: db.FieldValue.increment(amount),
      lastPurchaseAmount: amount,
      lastPurchaseDate: new Date()
    });

    console.log(`Updated tokens for user ${userId}:`, {
      previousTokens: currentTokens,
      addedTokens: amount,
      newTokenTotal: currentTokens + amount
    });
  } catch (error) {
    console.error('Error updating user tokens:', error);
    
    // Log additional context if available
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }
}

app.post('/api/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing Stripe signature or webhook secret');
    }

    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      webhookSecret
    );

    console.log('Webhook received:', event.type);
    logWebhookEvent(event);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', {
          sessionId: session.id,
          amount: session.amount_total,
          customer: session.customer_details,
          metadata: session.metadata
        });

        // Extract user ID and token amount from metadata
        if (session.metadata && session.metadata.userId) {
          // Convert amount to token amount (assuming 1 USD = 100 tokens)
          const tokenAmount = Math.floor(session.amount_total / 100);
          await updateUserTokens(session.metadata.userId, tokenAmount);
        }
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', {
          intentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata
        });

        // Extract user ID and token amount from metadata
        if (paymentIntent.metadata && paymentIntent.metadata.userId) {
          // Convert amount to token amount (assuming 1 USD = 100 tokens)
          const tokenAmount = Math.floor(paymentIntent.amount / 100);
          await updateUserTokens(paymentIntent.metadata.userId, tokenAmount);
        }
        break;

      case 'payment_intent.created':
        const createdPaymentIntent = event.data.object;
        console.log('Payment intent created:', {
          intentId: createdPaymentIntent.id,
          amount: createdPaymentIntent.amount
        });
        break;

      case 'charge.updated':
        const updatedCharge = event.data.object;
        console.log('Charge updated:', {
          chargeId: updatedCharge.id,
          status: updatedCharge.status
        });
        break;

      case 'charge.succeeded':
        const charge = event.data.object;
        console.log('Charge succeeded:', {
          chargeId: charge.id,
          amount: charge.amount,
          customer: charge.customer
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Webhook server listening at http://localhost:${port}`);
});

export default app;