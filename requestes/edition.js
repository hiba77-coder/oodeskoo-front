const BASE_URL = "http://localhost:3000/api/editions";

export const getEditions = () =>
  fetch(BASE_URL).then(r => r.json());

export const getEdition = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createEdition = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateEdition = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteEdition = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());