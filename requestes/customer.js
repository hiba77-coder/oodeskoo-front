const CUSTOMER_URL = "/api/customers";

export const getAllCustomers = async () => {
  try {
    const res = await fetch(CUSTOMER_URL);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getCustomerById = async (id) => {
  try {
    const res = await fetch(`${CUSTOMER_URL}/${id}`);
    if (!res.ok) throw new Error("Customer not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const createCustomer = async (data) => {
  try {
    const res = await fetch(CUSTOMER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const updateCustomer = async (id, data) => {
  try {
    const res = await fetch(`${CUSTOMER_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteCustomer = async (id) => {
  try {
    const res = await fetch(`${CUSTOMER_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete customer");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};