import axios from "../utils/axiosCustom";

export const getFeedbacksService = async ({
  search = "",
  date = "",
  page = 1,
  size = 5,
  sortBy,
  order,
  doctorId,
  patientId,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (date) params.append("date", date);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);
  if (doctorId) params.append("doctorId", doctorId);
  if (patientId) params.append("patientId", patientId);

  const queryString = params.toString();
  const url = `/feedbacks${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const addFeedbackService = async ({
  patientId,
  doctorId,
  serviceId,
  feedback,
}) => {
  return await axios.post("/feedbacks", {
    patientId,
    doctorId,
    serviceId,
    feedback,
  });
};

export const deleteFeedbackService = async (id) => {
  const res = await axios.delete(`/feedbacks/delete/${id}`);
  return res;
};

export const deleteFeedbacksService = async (arrayId) => {
  const res = await axios.delete("/feedbacks/delete", {
    data: arrayId,
  });
  return res;
};
