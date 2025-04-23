import admin from 'firebase-admin';
import { NextRequest } from 'next/server';

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_ADMIN_KEY!)
      ),
    });
  }

  export async function authenticateRequest(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.warn('Missing or invalid Authorization header');
      return null;
    }
  
    const token = authHeader.split('Bearer ')[1];
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken; // contains uid, email, etc.
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return null;
    }
  }