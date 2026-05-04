import { api } from "../src/api/axios";

const CAR_URL = "/cars";

export const getAllCars = async () => {
  const { data } = await api.get(CAR_URL);
  return data;
};

export const getCarById = async (id) => {
  const { data } = await api.get(`${CAR_URL}/${id}`);
  return data;
};

export const createCar = async (body) => {
  const { data } = await api.post(CAR_URL, body);
  return data;
};

export const updateCar = async (id, body) => {
  const { data } = await api.put(`${CAR_URL}/${id}`, body);
  return data;
};

export const deleteCar = async (id) => {
  const { data } = await api.delete(`${CAR_URL}/${id}`);
  return data;
};
