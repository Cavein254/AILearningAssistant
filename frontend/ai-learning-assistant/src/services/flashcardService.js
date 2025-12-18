import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";


const getAllFlashcards = async () => {
    try {
        const response = await axiosInstance.get(API_PATH.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to fetch flashcards"};
    }
}

const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATH.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to fetch flashcards for document"};
    }
}


const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATH.FLASHCARDS.REVIEW_FLASHCARD(cardId), {cardIndex});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to review flashcard"};
    }
}

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.post(API_PATH.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to toggle star"};
    }
}

const deleteFlashcard = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATH.FLASHCARDS.DELETE_FLASHCARD(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to delete flashcard"};
    }
}


const flashcardService = {
    getAllFlashcards,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcard
}

export default flashcardService;
