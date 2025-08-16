import { auth } from "@/firebase.config";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // const userInfo = useUser();

  // Login
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Create new user
  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Update profile (displayName, photoURL)
  const updateUserProfile = async (profile) => {
    if (!auth.currentUser) throw new Error("No user is signed in");
    await updateProfile(auth.currentUser, profile);
    setUser({ ...auth.currentUser });
  };

  // Google Login
  const googleLogin = async () => {
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    setAuthLoading(false);
    return result.user;
  };

  // Logout
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        try {
          const {
            data: { user },
          } = await axiosSecure(`/user/${firebaseUser?.email}`);
          await axiosSecure.post("/login", user);
          console.log("Headers", new Headers())
        } catch (error) {
          console.log(error);
        }
      } else {
        setUser(null);
        setAuthLoading(false);
        await axiosSecure.post("/logout");
      }
    });
    return unsubscribe;
  }, [axiosSecure]);

  const value = {
    user,
    authLoading,
    setAuthLoading,
    login,
    createUser,
    updateUserProfile,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}
