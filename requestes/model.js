const MODEL_URL = "/api/models";

export const getAllModels = async () => {
  try {
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error("Failed to fetch models");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getModelById = async (id) => {
  try {
    const res = await fetch(`${MODEL_URL}/${id}`);
    if (!res.ok) throw new Error("Model not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { name, years, engine, category, brandId, editionId }
export const createModel = async (data) => {
  try {
    const res = await fetch(MODEL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create model");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { name, years, engine, category, brandId, editionId }
export const updateModel = async (id, data) => {
  try {
    const res = await fetch(`${MODEL_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update model");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteModel = async (id) => {
  try {
    const res = await fetch(`${MODEL_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete model");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};