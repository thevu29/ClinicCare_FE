import axios from "../utils/axiosCustom";

export const getDoctorsService = async (
  search = "",
  page = 1,
  size = 5,
  sortBy = "specialty",
  order = "asc"
) => {
  const res = await axios.get(
    `/doctors?search=${search}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`
  );
  return res;
};

export const createDoctorService = async (doctor) => {
  const res = await axios.post("/doctors", doctor);
  return res;
}

export const updateDoctorService = async (doctor) => {
  const res = await axios.put(`/doctors/${doctor.doctorProfileId}`, doctor);
  return res;
}

export const deleteDoctorService = async (doctorId) => {
  const res = await axios.delete(`/doctors/${doctorId}`);
  return res;
}

