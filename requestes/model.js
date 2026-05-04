import { api } from "../src/api/axios";

const MODEL_URL = "/models";

export const getAllModels = async () => {
  const { data } = await api.get(MODEL_URL);
  return data;
};

export const getModelById = async (id) => {
  const { data } = await api.get(`${MODEL_URL}/${id}`);
  return data;
};

export const createModel = async (body) => {
  const { data } = await api.post(MODEL_URL, body);
  return data;
};

export const updateModel = async (id, body) => {
  const { data } = await api.put(`${MODEL_URL}/${id}`, body);
  return data;
};

export const deleteModel = async (id) => {
  const { data } = await api.delete(`${MODEL_URL}/${id}`);
  return data;
};

export const getModelsByBrand = async (brandId) => {
  const { data } = await api.get(`${MODEL_URL}?brandId=${brandId}`);
  return data;
};