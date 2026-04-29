const ORDER_URL = "/api/orders";

export const getAllOrders = async () => {
  try {
    const res = await fetch(ORDER_URL);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const getOrderById = async (id) => {
  try {
    const res = await fetch(`${ORDER_URL}/${id}`);
    if (!res.ok) throw new Error("Order not found");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { customerId, carId, date, price, status, finalPrice }
export const createOrder = async (data) => {
  try {
    const res = await fetch(ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

// data: { price, status, finalPrice }  ← only these 3 are updatable per your route
export const updateOrder = async (id, data) => {
  try {
    const res = await fetch(`${ORDER_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update order");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};

export const deleteOrder = async (id) => {
  try {
    const res = await fetch(`${ORDER_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete order");
    return await res.json();
  } catch (error) { console.error(error); throw error; }
};
