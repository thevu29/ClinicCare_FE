import axios from "../utils/axiosCustom";

export const getAllRoles = async () => {
  const res = await axios.get("/roles/all");
  return res;
};

export const getRolesService = async ({
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
  const url = `/roles${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getRoleService = async (id) => {
  const res = await axios.get(`/roles/${id}`);
  return res;
};

export const addRoleService = async (name, description) => {
  const res = await axios.post("/roles", {
    name,
    description,
  });
  return res;
};

export const updateRoleService = async (id, payload) => {
  const res = await axios.put(`/roles/update/${id}`, payload);
  return res;
};
