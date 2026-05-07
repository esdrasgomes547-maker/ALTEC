import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, doc, getDocFromServer } from 'firebase/firestore';

// Carrega config do Firebase via variáveis de ambiente (produção)
// ou do JSON local (dev) — nunca suba o JSON no git!
let jsonConfig: Record<string, string> = {};
try {
  const mod = await import('../../firebase-applet-config.json');
  jsonConfig = mod.default;
} catch { /* arquivo não existe em produção, tudo certo */ }

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || jsonConfig.apiKey,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || jsonConfig.authDomain,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || jsonConfig.projectId,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || jsonConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| jsonConfig.messagingSenderId,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || jsonConfig.appId,
};
const firestoreDatabaseId: string =
  import.meta.env.VITE_FIREBASE_DATABASE_ID || jsonConfig.firestoreDatabaseId || '(default)';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);

// Simple anonymous login to satisfy "isSignedIn()" rules easily, since the user didn't request a full auth UI but rules need auth
export const signInAnonymousUser = () => {
  return signInAnonymously(auth);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
