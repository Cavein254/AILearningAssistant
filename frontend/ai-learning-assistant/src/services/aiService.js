import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

const generateFlashCards = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATH.AI.GENERATE_FLASHCARDS, { documentId, ...options });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Flashcard generation went wrong"};
    }
}


const generateQuiz = async (documentId, options) => {
    try {
        const response = await axiosInstance.post(API_PATH.AI.GENERATE_QUIZ, { documentId, ...options });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Quiz generation went wrong"};
    }
}


const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATH.AI.GENERATE_SUMMARY, { documentId });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Summary generation went wrong"};
    }
}


const chat = async (documentId,message) => {
    try {
        const response = await axiosInstance.post(API_PATH.AI.CHAT, { documentId, question:message });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Chat request went wrong"};
    }
}

const explainConcept = async (documentId,concept) => {
    try {
        const response = await axiosInstance.post(API_PATH.AI.EXPLAIN_CONCEPT, { documentId, concept });
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Concept explanation went wrong"};
    }
}


const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATH.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "Chat history went wrong"};
    }
}


const aiService = {
    generateFlashCards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
}
