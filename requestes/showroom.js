import { api } from "../src/api/axios";

const SHOWROOM_URL = "/showrooms";

export const getAllShowrooms = async () => {
  const { data } = await api.get(SHOWROOM_URL);
  return data;
};

export const getShowroomById = async (id) => {
  const { data } = await api.get(`${SHOWROOM_URL}/${id}`);
  return data;
};

export const createShowroom = async (body) => {
  const { data } = await api.post(SHOWROOM_URL, body);
  return data;
};

export const updateShowroom = async (id, body) => {
  const { data } = await api.put(`${SHOWROOM_URL}/${id}`, body);
  return data;
};

export const deleteShowroom = async (id) => {
  const { data } = await api.delete(`${SHOWROOM_URL}/${id}`);
  return data;
};
