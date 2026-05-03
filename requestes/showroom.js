const SHOWROOM_URL = "/api/showrooms";

export const getAllShowrooms = async () => {
  try {
    const res = await fetch(SHOWROOM_URL);
    if (!res.ok) throw new Error("Failed to fetch showrooms");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getShowroomById = async (id) => {
  try {
    const res = await fetch(`${SHOWROOM_URL}/${id}`);
    if (!res.ok) throw new Error("Showroom not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { name, address, phone, managerName, managerPhone, managerEmail }
export const createShowroom = async (data) => {
  try {
    const res = await fetch(SHOWROOM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create showroom");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { name, address, phone, managerName, managerPhone, managerEmail }
export const updateShowroom = async (id, data) => {
  try {
    const res = await fetch(`${SHOWROOM_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update showroom");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteShowroom = async (id) => {
  try {
    const res = await fetch(`${SHOWROOM_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete showroom");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};
