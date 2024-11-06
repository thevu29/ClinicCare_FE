import axios from "../utils/axiosCustom";

export const getUsersService = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy = "",
  order = "",
}) => {
  const res = await axios.get(
    `/users?search=${search}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};

export const getUserService = async (id) => {
  return await axios.get(`/users/${id}`);
};

export const addUserService = async (formData) => {
  const res = await axios.post("/users", formData);
  return res;
};

export const updateUserService = async (id, formData) => {
  const res = await axios.put(`/users/update/${id}`, formData);
  return res;
}
