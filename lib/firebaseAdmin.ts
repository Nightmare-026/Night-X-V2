import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!privateKey || !projectId || !clientEmail) {
    console.warn('Firebase Admin environment variables are missing. Initialization skipped.');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  }
}

const adminAuth = admin.apps.length ? admin.auth() : null;
const adminDb = admin.apps.length ? admin.firestore() : null;

export { adminAuth, adminDb };

/**
 * Increments the AI usage count for a user and tool on the current date.
 */
export async function incrementAIUsage(userId: string, tool: string) {
  if (!adminDb) return;
  
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
