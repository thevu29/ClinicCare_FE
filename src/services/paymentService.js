import axios from "../utils/axiosCustom";

export const paymentForUserService = async (amount) => {
  const res = await axios.get("/vnpay/create-payment", {
    params: {
      amount: amount,
    },
  });
  return res;
};
