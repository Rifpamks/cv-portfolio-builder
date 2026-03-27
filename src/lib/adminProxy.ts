import { auth } from "@/lib/firebase";

async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return user.getIdToken();
}

async function fetchAdminApi(payload: any) {
  const token = await getAuthToken();
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Admin API Error: ${res.status}`);
  }
  return res.json();
}

// Proxied Firebase client SDK equivalents
export const adminGetDoc = async (collection: string, docId: string) => {
  const result = await fetchAdminApi({ action: "get", collection, docId });
  return {
    exists: () => result.exists,
    data: () => result.data
  };
};

export const adminUpdateDoc = async (collection: string, docId: string, data: any) => {
  return fetchAdminApi({ action: "update", collection, docId, data });
};

export const adminSetDoc = async (collection: string, docId: string, data: any) => {
  return fetchAdminApi({ action: "set", collection, docId, data });
};
