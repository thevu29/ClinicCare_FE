import axios from "../utils/axiosCustom";

export const getAllAppointmentsService = async () => {
  return axios.get("/appointments/all");
};

export const getAppointmentsService = async ({
  search = "",
  date = "",
  status = "",
  page = 1,
  size = 5,
  sortBy,
  order,
  patientId,
  userId,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (date) params.append("date", date);
  if (status) params.append("status", status);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);
  if (patientId) params.append("patientId", patientId);
  if (userId) params.append("userId", userId);

  const queryString = params.toString();
  const url = `/appointments${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getAppointmentByIdService = async (id) => {
  return axios.get(`/appointments/${id}`);
};

export const addAppointmentService = async (data) => {
  return axios.post("/appointments", data);
};

export const cancelAppointmentService = async (id, data) => {
  return axios.put(`/appointments/cancel/${id}`, data);
};

export const completeAppointmentService = async (id) => {
  return axios.put(`/appointments/complete/${id}`);
};
