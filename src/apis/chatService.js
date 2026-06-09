import axiosClient from './axiosClient';

/** Gửi lịch sử chat → Laravel → Gemini. Trả về reply, suggestions, products. */
export const sendChatMessage = async (messages) => {
    const res = await axiosClient.post('/chat', { messages });
    return res.data;
};
