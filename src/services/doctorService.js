import axios from "../utils/axiosCustom";

export const getDoctorsService = async ({
  search = "",
  page = 1,
  size = 5,
  sortBy = "",
  order = "",
}) => {
  const res = await axios.get(
    `/doctors?search=${search}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};

export const getDoctorServiceById = async (id) => {
  return await axios.get(`/doctors/${id}`);
};


export const createDoctorService = async (doctor) => {
  const res = await axios.post("/doctors", doctor);
  return res;
};

export const updateDoctorService = async (id, doctor) => {
  const res = await axios.put(`/doctors/update/${id}`, doctor);
  return res;
};

