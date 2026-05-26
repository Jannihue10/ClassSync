import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc, setDoc, getDoc, updateDoc,
} from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);  // Firebase auth user
  const [profile, setProfile] = useState(null);  // Firestore user doc
  const [loading, setLoading] = useState(true);

  // Load Firestore profile whenever auth user changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) setProfile(snap.data());
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Register: create auth user + Firestore profile
  const register = async (email, password, nickname) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profileData = {
      uid:       cred.user.uid,
      nickname,
      email,
      klasseId:  null,
      kurseIds:  [],
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", cred.user.uid), profileData);
    setProfile(profileData);
    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  // Update local profile cache + Firestore
  const updateProfile = async (data) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), data);
    setProfile(p => ({ ...p, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);