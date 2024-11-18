import axios from "../utils/axiosCustom";

export const addPaymentService = async (payload) => {
  const res = await axios.post("/payments", payload);
  return res;
};

export const updatePaymentStatusService = async (payload) => {
  const res = await axios.put(`/payments/change-status/${payload.paymentId}`, {
    status: payload.status,
  });
  return res;
};
