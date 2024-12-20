import axios from "../utils/axiosCustom";

export const getPromotionsService = async ({
  search = "",
  status = "",
  discount = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (discount) params.append("discount", discount);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/promotions${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getPromotionByIdService = async (id) => {
  return await axios.get(`/promotions/${id}`);
};

export const addPromotionService = async (data) => {
  const res = await axios.post("/promotions", data);
  return res;
};

export const updatePromotionService = async (id, data) => {
  const res = await axios.put(`/promotions/update/${id}`, data);
  return res;
};

export const getAllPromotionsService = async () => {
  return await axios.get("/promotions/all");
}
