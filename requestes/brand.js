import { api } from "../src/api/axios";

const BASE_URL = "/brands";

export const getAllBrands = async () => {
  const { data } = await api.get(BASE_URL);
  return data;
};

export const getBrandById = async (id) => {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
};

export const createBrand = async (body) => {
  const { data } = await api.post(BASE_URL, body);
  return data;
};

export const updateBrand = async (id, body) => {
  const { data } = await api.put(`${BASE_URL}/${id}`, body);
  return data;
};

export const deleteBrand = async (id) => {
  const { data } = await api.delete(`${BASE_URL}/${id}`);
  return data;
};