import axiosClient from './axiosClient';
export const sendChatMessage = async (messages) => {
    const res = await axiosClient.post('/chat', { messages });
    return res.data;
};

