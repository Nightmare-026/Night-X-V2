import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY is missing');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const adminAuth = admin.apps.length ? admin.auth() : null as any;
const adminDb = admin.apps.length ? admin.firestore() : null as any;

/**
 * Increments the AI usage count for a user and tool on the current date.
 */
export async function incrementAIUsage(userId: string, tool: string) {
  const today = new Date().toISOString().split('T')[0];
  const usageId = `${userId}_${tool}_${today}`;
  const usageRef = adminDb.collection('ai_usage').doc(usageId);

  try {
    const doc = await usageRef.get();
    if (!doc.exists) {
      await usageRef.set({
        user_id: userId,
        tool: tool,
        usage_date: today,
        count: 1,
        last_used: new Date().toISOString()
      });
    } else {
      await usageRef.update({
        count: admin.firestore.FieldValue.increment(1),
        last_used: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error incrementing AI usage:', error);
  }
}

export { adminAuth, adminDb };
