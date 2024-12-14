import axios from "../utils/axiosCustom";

export const chatService = async (prompt) => {
    return axios.get(`/ai/chat?prompt=${prompt}`);
}