import admin from 'firebase-admin';

// Ensure the app is not initialized multiple times
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'luna-games-445108',
      clientEmail: 'firebase-adminsdk-5b8pg@luna-games-445108.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: 'https://luna-games-445108.firebaseio.com'
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
