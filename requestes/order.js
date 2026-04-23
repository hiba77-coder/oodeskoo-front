const BASE_URL = "http://localhost:3000/api/orders";

export const getOrders = () =>
  fetch(BASE_URL).then(r => r.json());

export const getOrder = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createOrder = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateOrder = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteOrder = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());