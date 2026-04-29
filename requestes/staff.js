const STAFF_URL = "/api/staff";

export const getAllStaff = async () => {
  try {
    const res = await fetch(STAFF_URL);
    if (!res.ok) throw new Error("Failed to fetch staff");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getStaffById = async (id) => {
  try {
    const res = await fetch(`${STAFF_URL}/${id}`);
    if (!res.ok) throw new Error("Staff not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { fullName, email, phone, password, Role, showroomId }
export const createStaff = async (data) => {
  try {
    const res = await fetch(STAFF_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create staff");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { fullName, email, phone, password, Role, showroomId }
export const updateStaff = async (id, data) => {
  try {
    const res = await fetch(`${STAFF_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update staff");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteStaff = async (id) => {
  try {
    const res = await fetch(`${STAFF_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete staff");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};