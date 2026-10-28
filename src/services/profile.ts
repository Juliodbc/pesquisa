import { doc, getDoc, setDoc, type DocumentData } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { requireFirebase } from './firebase';

export interface UserProfile {
  fullName: string;
  birthDate: string;
  nickname: string;
  photoURL: string;
}

export const emptyProfile = (): UserProfile => ({ fullName: '', birthDate: '', nickname: '', photoURL: '' });

export async function getProfile(uid: string): Promise<UserProfile> {
  const { db } = requireFirebase();
  const [snapshot, imageSnapshot] = await Promise.all([getDoc(doc(db, 'users', uid)), getDoc(doc(db, 'images', uid))]);
  const profile = snapshot.exists() ? { ...emptyProfile(), ...(snapshot.data() as DocumentData) } : emptyProfile();
  const image = imageSnapshot.data()?.image;
  if (typeof image === 'string' && image) profile.photoURL = `data:image/jpeg;base64,${image}`;
  return profile;
}

async function imageToBase64(blob: Blob): Promise<string> {
  const source = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = source;
    await image.decode();
    const scale = Math.min(1, 720 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível processar a imagem.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
    const base64 = dataUrl.split(',')[1];
    if (!base64 || base64.length > 850_000) {
      throw new Error('A imagem ficou grande demais para salvar no Firestore. Escolha outra foto.');
    }
    return base64;
  } finally {
    URL.revokeObjectURL(source);
  }
}

export async function saveProfile(uid: string, profile: UserProfile, image?: Blob) {
  const { db, storage } = requireFirebase();
  let photoURL = profile.photoURL;
  if (image) {
    const base64 = await imageToBase64(image);
    const imageRef = ref(storage, `users/${uid}/profile`);
    await uploadBytes(imageRef, image, { contentType: image.type || 'image/jpeg' });
    photoURL = await getDownloadURL(imageRef);
    await setDoc(doc(db, 'images', uid), { image: base64, updatedAt: new Date().toISOString() });
  }
  const result = { ...profile, photoURL, updatedAt: new Date().toISOString() };
  await setDoc(doc(db, 'users', uid), result, { merge: true });
  return result;
}
