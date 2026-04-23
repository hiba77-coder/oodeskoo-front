const BASE_URL = "http://localhost:3000/api/staff";

export const getStaff = () =>
  fetch(BASE_URL).then(r => r.json());

export const getStaffById = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createStaff = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateStaff = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteStaff = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());