const BASE_URL = "http://localhost:3000/api/customers";

export const getCustomers = () =>
  fetch(BASE_URL).then(r => r.json());

export const getCustomer = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createCustomer = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateCustomer = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteCustomer = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());