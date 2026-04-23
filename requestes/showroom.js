const BASE_URL = "http://localhost:3000/api/showrooms";

export const getShowrooms = () =>
  fetch(BASE_URL).then(r => r.json());

export const getShowroom = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createShowroom = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateShowroom = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteShowroom = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());