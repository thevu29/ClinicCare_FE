import axios from "../utils/axiosCustom";

export const getPromotionsService = async (
  search = "",
  page = 1,
  size = 5,
  sortBy = "createAt",
  order = "desc"
) => {
  const res = await axios.get(
    `promotions?search=${search}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};
