import axios from "../utils/axiosCustom";

export const getServicesManager = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/services${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getServiceByIdManager = async (id) => {
  return await axios.get(`/services/${id}`);
};

export const addServiceManager = async (data) => {
  const res = await axios.post("/services", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

export const updateServiceManager = async (id, data) => {
  const res = await axios.put(`/services/update/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res;
};

export const deleteServiceManager = async (id) => {
  return await axios.delete(`/services/delete/${id}`);
};

export const applyPromotionService = async (id, data) => {
  return await axios.put(`/services/apply-promotion/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const removePromotionService = async (id) => {
  return await axios.put(`/services/remove-promotion/${id}`);
};
