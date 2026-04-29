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