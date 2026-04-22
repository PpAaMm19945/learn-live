import * as admin from 'firebase-admin';

// Check if Firebase has already been initialized
if (admin.apps.length === 0) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'learn-live-488609',
        // The SDK will look for credentials in the environment variable GOOGLE_APPLICATION_CREDENTIALS
    });
    console.log('[FIREBASE] Admin SDK initialized');
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
