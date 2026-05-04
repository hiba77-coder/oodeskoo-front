import { api } from "../src/api/axios";

const EDITION_URL = "/editions";

export const getAllEditions = async () => {
  const { data } = await api.get(EDITION_URL);
  return data;
};

export const getEditionById = async (id) => {
  const { data } = await api.get(`${EDITION_URL}/${id}`);
  return data;
};

export const createEdition = async (body) => {
  const { data } = await api.post(EDITION_URL, body);
  return data;
};

export const updateEdition = async (id, body) => {
  const { data } = await api.put(`${EDITION_URL}/${id}`, body);
  return data;
};

export const deleteEdition = async (id) => {
  const { data } = await api.delete(`${EDITION_URL}/${id}`);
  return data;
};

export const getEditionsByModel = async (modelId) => {
  const { data } = await api.get(`${EDITION_URL}?modelId=${modelId}`);
  return data;
};