import axios from "../utils/axiosCustom";

export const getAllPaymentsService = async () => {
  return await axios.get("/payments/all");
};

export const getPaymentsService = async ({
  search = "",
  status,
  method,
  date,
  price,
  page = 1,
  size = 5,
  sortBy,
  order,
  patientId,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (method) params.append("method", method);
  if (date) params.append("date", date);
  if (price) params.append("price", price);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);
  if (patientId) params.append("patientId", patientId);

  const queryString = params.toString();
  const url = `/payments${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const getPaymentByIdService = async (id) => {
  return await axios.get(`/payments/${id}`);
};

export const addPaymentService = async (payload) => {
  return await axios.post("/payments", payload);
};

export const updatePaymentStatusService = async (payload) => {
  return await axios.put(`/payments/change-status/${payload.paymentId}`, {
    status: payload.status,
  });
};

export const checkResponseFromVNPay = async (params) => {
  const res = await axios.get("/payments/check-response", {
    params: params,
  });
  return res;
};
