import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const APP_DOC = "app_data/main";

export const getAppData = async () => {
  const ref = doc(db, APP_DOC);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveAppData = async (data: any) => {
  const ref = doc(db, APP_DOC);
  await setDoc(ref, data, { merge: true });
};
