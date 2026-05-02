const BASE_URL = "/api/brands"; // Vite proxy forwards this to Vercel in dev

// GET all brands
export const getAllBrands = async () => {
    try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch brands");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// GET brand by id
export const getBrandById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Brand not found");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
// 02/05/26

export const createBrand = async (data) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create brand");
    return await response.json();
  } catch (error) { console.error(error); throw error; }
};

export const updateBrand = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update brand");
    return await response.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteBrand = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete brand");
    return await response.json();
  } catch (error) { console.error(error); throw error; }
};