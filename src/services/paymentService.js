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

export const checkResponseFromVNPay = async (params) => {
  const res = await axios.get("/payments/check-response", {
    params: params,
  });
  return res;
};
