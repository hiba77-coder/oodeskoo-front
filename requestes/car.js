const BASE_URL = "http://localhost:3000/api/cars";

export const getCars = () =>
  fetch(BASE_URL).then(r => r.json());

export const getCar = (id) =>
  fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createCar = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateCar = (id, data) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteCar = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());