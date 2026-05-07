import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

export function useSubscription() {
  const [role, setRole] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isMasterRole, setIsMasterRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;
    let unsubMaster: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "esdrasgomes547@gmail.com") {
          setIsMasterRole(true);
        } else if (user.email) {
          unsubMaster = onSnapshot(doc(db, "masters", user.email), (snap) => {
             if (snap.exists()) setIsMasterRole(true);
             else setIsMasterRole(false);
          }, (err) => console.warn(err)); // Might throw permission denied if not master, which is fine
        }

        unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role);
            setOrgId(data.orgId);
            setPlan(data.plan);
          }
          setLoading(false);
        }, (error) => {
          setLoading(false);
        });

      } else {
        setRole(null);
        setOrgId(null);
        setPlan(null);
        setIsMasterRole(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
      if (unsubMaster) unsubMaster();
    };
  }, []);

  return {
    role,
    plan,
    orgId,
    loading,
    isActive: role === "premium_max" || isMasterRole,
    isMaster: isMasterRole
  };
}
