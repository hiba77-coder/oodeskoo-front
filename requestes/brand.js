const BASE_URL = "http://localhost:3000/api/brands";

export const getBrands = () =>
    fetch(BASE_URL).then(r => r.json());

export const getBrand = (id) =>
    fetch(`${BASE_URL}/${id}`).then(r => r.json());

export const createBrand = (data) =>
    fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const updateBrand = (id, data) =>
    fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(r => r.json());

export const deleteBrand = (id) =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then(r => r.json());