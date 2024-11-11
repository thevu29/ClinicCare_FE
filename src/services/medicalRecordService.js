import axios from "../utils/axiosCustom";

// export const getMedicalRecordsService = async ({
//   search = "",
//   page = 1,
//   size = 5,
//   sortBy = "",
//   order = "",
// }) => {
//   const res = await axios.get(
//     `/medical-records?search=${search}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
//   );
//   return res;
// };

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

export const createMedicalRecordService = async (medicalRecord) => {
  const res = await axios.post("/medical-records", medicalRecord);
  return res;
};

export const updateMedicalRecordService = async (id, medicalRecord) => {
  const res = await axios.put(`/medical-records/update/${id}`, medicalRecord);
  return res;
};

export const deleteMedicalRecordService = async (id) => {
  const res = await axios.delete(`/medical-records/delete/${id}`);
  return res;
};

export const getUserFormService = async (role) => {
  try {
    const res = await axios.get(`/users/role/${role}`);
    return res;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
};

export const getDoctorFormService = async () => {
  try {
    const res = await axios.get("/doctors");
    return res;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

export const getServiceManager = async () => {
  const res = await axios.get("/services");
  return res;
};
