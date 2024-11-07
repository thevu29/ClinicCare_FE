import axios from "../utils/axiosCustom";

export const getRolesService = async () => {
  const res = await axios.get("/roles");
  return res;
};

export const getRoleService = async (id) => {
  const res = await axios.get(`/roles/${id}`);
  return res;
};

export const addRoleService = async (formData) => {
  const res = await axios.post("/roles", formData);
  return res;
};

export const updateRoleService = async (id, formData) => {
  const res = await axios.put(`/roles/update/${id}`, formData);
  return res;
};
