import axios from "../utils/axiosCustom";

export const getUserStatisticsService = async (month, year) => {
  return await axios.get(`users/statistics?month=${month}&year=${year}`);
};

export const getAppointmentStatisticsService = async (month, year) => {
  return await axios.get(`appointments/statistics?month=${month}&year=${year}`);
};

export const getTopServices = async (top) => {
  return await axios.get(`services/top-services?top=${top}`);
};

export const getRevenuesService = async (month, year) => {
    return await axios.get(`payments/revenues?month=${month}&year=${year}`);
}