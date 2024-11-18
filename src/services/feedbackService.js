import axios from "../utils/axiosCustom";

export const getFeedbacksService = async ({
  search = "",
  date = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (date) params.append("date", date);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/feedbacks${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
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
