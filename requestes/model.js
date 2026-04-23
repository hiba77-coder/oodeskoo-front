const BASE_URL = "http://localhost:3000/api/models";

export const getModels = () =>
  fetch(BASE_URL).then(r => r.json());

export const getModel = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createModel = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateModel = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteModel = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());