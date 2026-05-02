const EDITION_URL = "/api/editions";

export const getAllEditions = async () => {
  try {
    const res = await fetch(EDITION_URL);
    if (!res.ok) throw new Error("Failed to fetch editions");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getEditionById = async (id) => {
  try {
    const res = await fetch(`${EDITION_URL}/${id}`);
    if (!res.ok) throw new Error("Edition not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const createEdition = async (data) => {
  try {
    const res = await fetch(EDITION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create edition");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const updateEdition = async (id, data) => {
  try {
    const res = await fetch(`${EDITION_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update edition");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteEdition = async (id) => {
  try {
    const res = await fetch(`${EDITION_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete edition");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};
//01/05/26
export const getEditionsByModel = async (modelId) => {
  try {
    const res = await fetch(`${EDITION_URL}?modelId=${modelId}`);
    if (!res.ok) throw new Error("Failed to fetch editions by model");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};