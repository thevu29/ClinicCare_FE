import axios from "../utils/axiosCustom";

export const getUsersService = async (
  search = "",
  page = 1,
  size = 5,
  sortBy = "id",
  order = "asc"
) => {
  const res = await axios.get(
    `/users?search=${search}page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};
