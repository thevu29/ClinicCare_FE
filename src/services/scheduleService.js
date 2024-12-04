import axios from "../utils/axiosCustom";

export const getAllSchedulesService = async ({ userId }) => {
  const params = new URLSearchParams();

  if (userId) params.append("userId", userId);

  const queryString = params.toString();
  const url = `/schedules/all${queryString ? `?${queryString}` : ""}`;

  return await axios.get(url);
};

export const getSchedulesService = async ({
  search = "",
  date = "",
  status = "",
  page = 1,
  size = 5,
  sortBy,
  order,
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
  if (userId) params.append("userId", userId);

  const queryString = params.toString();
  const url = `/schedules${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getScheduleByIdService = async (id) => {
  return await axios.get(`/schedules/${id}`);
};

export const addScheduleService = async (data) => {
  return await axios.post("/schedules", data);
};

export const autoAddScheduleService = async (data) => {
  return await axios.post("/schedules/auto-create", data);
};

export const updateScheduleService = async (id, data) => {
  return await axios.put(`/schedules/${id}`, data);
};
