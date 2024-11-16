import axios from "../utils/axiosCustom";

export const getByUserIdService = async (userId, cursor = "", size = 5) => {
  const res = await axios.get("/notifications", {
    params: {
      userId,
      cursor,
      size,
    },
  });
  return res;
};
