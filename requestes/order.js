import { api } from "../src/api/axios";

const ORDER_URL = "/orders";

export const getAllOrders = async () => {
  const { data } = await api.get(ORDER_URL);
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`${ORDER_URL}/${id}`);
  return data;
};

export const createOrder = async (body) => {
  const { data } = await api.post(ORDER_URL, body);
  return data;
};

export const updateOrder = async (id, body) => {
  const { data } = await api.put(`${ORDER_URL}/${id}`, body);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`${ORDER_URL}/${id}`);
  return data;
};
