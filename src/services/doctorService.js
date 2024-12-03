import axios from "../utils/axiosCustom";

export const getDoctorsService = async ({
  search = "",
  serviceId = "",
  page = 1,
  size = 5,
  sortBy,
  order,
}) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (serviceId) params.append("serviceId", serviceId);
  if (page) params.append("page", page);
  if (size) params.append("size", size);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  const queryString = params.toString();
  const url = `/doctors${queryString ? `?${queryString}` : ""}`;

  const res = await axios.get(url);
  return res;
};

export const getAllDoctorsService = async () => {
  return await axios.get("/doctors/all");
}

export const getDoctorByIdService = async (id) => {
  return await axios.get(`/doctors/${id}`);
};

export const createDoctorService = async (formData) => {
  const res = await axios.post("/doctors", formData);
  return res;
};

export const updateDoctorService = async (id, formData) => {
  const res = await axios.put(`/doctors/update/${id}`, formData);
  return res;
};

export const deleteDoctorService = async (id) => {
  const res = await axios.delete(`/doctors/delete/${id}`);
  return res;
};

