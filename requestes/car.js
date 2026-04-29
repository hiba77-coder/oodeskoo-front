const CAR_URL = "/api/cars";

export const getAllCars = async () => {
  try {
    const res = await fetch(CAR_URL);
    if (!res.ok) throw new Error("Failed to fetch cars");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getCarById = async (id) => {
  try {
    const res = await fetch(`${CAR_URL}/${id}`);
    if (!res.ok) throw new Error("Car not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const createCar = async (data) => {
  try {
    const res = await fetch(CAR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create car");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const updateCar = async (id, data) => {
  try {
    const res = await fetch(`${CAR_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update car");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteCar = async (id) => {
  try {
    const res = await fetch(`${CAR_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete car");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};
