import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, type User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { requireFirebase } from './firebase';
import { emptyProfile } from './profile';

export const currentUser = ref<User | null>(null);
export const sessionReady = ref(false);
let listenerStarted = false;
export function initializeSession() {
  if (listenerStarted) return;
  listenerStarted = true;
  const { auth } = requireFirebase();
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    sessionReady.value = true;
  });
}
export async function createAccount(name: string, email: string, password: string) {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await setDoc(doc(db, 'users', credential.user.uid), { ...emptyProfile(), fullName: name, email });
}
