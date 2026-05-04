import { api } from "../src/api/axios";

const STAFF_URL = "/staff";

export const getAllStaff = async () => {
  const { data } = await api.get(STAFF_URL);
  return data;
};

export const getStaffById = async (id) => {
  const { data } = await api.get(`${STAFF_URL}/${id}`);
  return data;
};

export const createStaff = async (body) => {
  const { data } = await api.post(STAFF_URL, body);
  return data;
};

export const updateStaff = async (id, body) => {
  const { data } = await api.put(`${STAFF_URL}/${id}`, body);
  return data;
};

export const deleteStaff = async (id) => {
  const { data } = await api.delete(`${STAFF_URL}/${id}`);
  return data;
};