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
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore/lite';

import { db } from './firebaseconfig';

export type Curriculo = {
  id?: string;
  fullName: string;
  cpf: string;
  jobTitle: string;
  email: string;
  phone: string;
  github?: string;
  linkedin?: string;
  summary: string;
  profileImage?: string;
  skills?: Array<{
    skill: string;
  }>;
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
    
    if (!db) {
      throw new Error('Firestore não foi inicializado. Verifique as variáveis de ambiente.');
    }

    console.log("📝 [CurriculoService] Adicionando documento à coleção:", COLLECTION_NAME);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      fullName: curriculo.fullName?.trim() || "",
      cpf: curriculo.cpf?.trim() || "",
      jobTitle: curriculo.jobTitle?.trim() || "",
      email: curriculo.email?.trim() || "",
      phone: curriculo.phone?.trim() || "",
      github: (curriculo.github || "")?.trim(),
      linkedin: (curriculo.linkedin || "")?.trim(),
      summary: curriculo.summary?.trim() || "",
      profileImage: curriculo.profileImage || "",
      skills: (curriculo.skills || []).map(skill => ({
        skill: skill.skill?.trim() || "",
      })),
      experience: (curriculo.experience || []).map(exp => ({
        company: exp.company?.trim() || "",
        position: exp.position?.trim() || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        description: exp.description?.trim() || "",
      })),
      education: (curriculo.education || []).map(edu => ({
        institution: edu.institution?.trim() || "",
        degree: edu.degree?.trim() || "",
        year: edu.year || "",
      })),
      createdAt: serverTimestamp(),
    });
    
    console.log("✅ [CurriculoService] Documento criado com sucesso. ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ [CurriculoService] Erro ao cadastrar:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Name:", error.name);
      console.error("Stack:", error.stack);
    }
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      console.error("Code:", errorObj.code);
      console.error("Details:", errorObj.message);
    }
    throw error;
  }
}

const normalizeCurriculo = (item: QueryDocumentSnapshot) => {
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
    fullName: curriculo.fullName?.trim() || "",
    cpf: curriculo.cpf?.trim() || "",
    jobTitle: curriculo.jobTitle?.trim() || "",
    email: curriculo.email?.trim() || "",
    phone: curriculo.phone?.trim() || "",
    github: (curriculo.github || "")?.trim(),
    linkedin: (curriculo.linkedin || "")?.trim(),
    summary: curriculo.summary?.trim() || "",
    profileImage: curriculo.profileImage || "",
    skills: (curriculo.skills || []).map(skill => ({
      skill: skill.skill?.trim() || "",
    })),
    experience: (curriculo.experience || []).map(exp => ({
      company: exp.company?.trim() || "",
      position: exp.position?.trim() || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description?.trim() || "",
    })),
    education: (curriculo.education || []).map(edu => ({
      institution: edu.institution?.trim() || "",
      degree: edu.degree?.trim() || "",
      year: edu.year || "",
    })),
  });
}

export async function excluirCurriculo(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
