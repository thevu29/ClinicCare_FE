import axios from "../utils/axiosCustom";

export const getRolesService = async (
  search = "",
  page = 1,
  size = 5,
  sortBy = "id",
  order = "asc"
) => {
  const res = await axios.get(
    `/roles?search=${search}page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};
