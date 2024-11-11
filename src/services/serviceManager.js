import axios from "../utils/axiosCustom";

export const getServicesManager = async ({
  search = "",
  page = 1,
  size = 5,
  name = "",
  price = "",
  status = "",
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (name) params.append("name", name);
  if (price) params.append("price", price);
  if (status) params.append("status", status);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/services${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};
