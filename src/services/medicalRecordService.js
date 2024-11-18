import axios from "../utils/axiosCustom";

export const getMedicalRecordsService = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/medical-records${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getMedicalRecordServiceById = async (id) => {
  return await axios.get(`/medical-records/${id}`);
};

export const createMedicalRecordService = async (data) => {
  const res = await axios.post("/medical-records", data);
  return res;
};

export const updateMedicalRecordService = async (id, data) => {
  const res = await axios.put(`/medical-records/update/${id}`, data);
  return res;
};

export const deleteMedicalRecordService = async (id) => {
  const res = await axios.delete(`/medical-records/delete/${id}`);
  return res;
};

export const exportMedicalRecordsService = async () => {
  const res = await axios.get("/medical-records/export", {
    responseType: "blob",
  });
  console.log(res);
  return res;
};
