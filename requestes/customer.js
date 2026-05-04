import { api } from "../src/api/axios";

const CUSTOMER_URL = "/customers";

export const getAllCustomers = async () => {
  const { data } = await api.get(CUSTOMER_URL);
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await api.get(`${CUSTOMER_URL}/${id}`);
  return data;
};

export const createCustomer = async (body) => {
  const { data } = await api.post(CUSTOMER_URL, body);
  return data;
};

export const updateCustomer = async (id, body) => {
  const { data } = await api.put(`${CUSTOMER_URL}/${id}`, body);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`${CUSTOMER_URL}/${id}`);
  return data;
};