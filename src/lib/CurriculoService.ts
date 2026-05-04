import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from './firebaseconfig';

export type Curriculo = {
  id?: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  github?: string;
  linkedin?: string;
  summary: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  createdAt?: unknown;
};

const COLLECTION_NAME = "curriculos";

export async function testarConexaoFirestore() {
  const q = query(collection(db, COLLECTION_NAME), limit(1));
  const snapshot = await getDocs(q);
  return {
    ok: true,
    totalEncontrado: snapshot.size,
  };
}

export async function cadastrarCurriculo(curriculo: Curriculo) {
  try {
    console.log("📝 [CurriculoService] Iniciando cadastro com dados:", curriculo);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      fullName: curriculo.fullName,
      jobTitle: curriculo.jobTitle,
      email: curriculo.email,
      phone: curriculo.phone,
      github: curriculo.github || "",
      linkedin: curriculo.linkedin || "",
      summary: curriculo.summary,
      experience: curriculo.experience || [],
      education: curriculo.education || [],
      createdAt: serverTimestamp(),
    });
    console.log("✅ [CurriculoService] Documento criado com sucesso. ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ [CurriculoService] Erro ao cadastrar:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Name:", error.name);
    }
    if (typeof error === 'object' && error !== null) {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    throw error;
  }
}

const normalizeCurriculo = (item: any) => {
  const data = item.data();
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || null;

  return {
    id: item.id,
    ...data,
    createdAt,
  } as Curriculo;
};

export async function listarCurriculos() {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("fullName", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeCurriculo) as Curriculo[];
}

export async function pesquisarCurriculosPorNome(nome: string) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("fullName", ">=", nome),
    where("fullName", "<=", nome + "\uf8ff")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeCurriculo) as Curriculo[];
}

export async function buscarCurriculoPorId(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || null;

  return {
    id: snapshot.id,
    ...data,
    createdAt,
  } as Curriculo;
}

export async function atualizarCurriculo(id: string, curriculo: Omit<Curriculo, "id">) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    fullName: curriculo.fullName,
    jobTitle: curriculo.jobTitle,
    email: curriculo.email,
    phone: curriculo.phone,
    github: curriculo.github || "",
    linkedin: curriculo.linkedin || "",
    summary: curriculo.summary,
    experience: curriculo.experience || [],
    education: curriculo.education || [],
  });
}

export async function excluirCurriculo(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
