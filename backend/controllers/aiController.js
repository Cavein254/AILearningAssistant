import Document from "../models/Document.js";
import Flashcard from "../models/Flashcards.js";
import ChatHistory from "../models/ChatHistory.js";
import Quiz from "../models/Quiz.js";
import * as geminiService from  "../utils/geminiService.js"
import { findRelevantChunks } from "../utils/textChunker.js";

export const generateFlashcards = async (req, res, next) => {
    try {
        const {documentId, count=10} = req.body;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status:'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not ready",
                statusCode: 404
            })
        }

        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false,
            }))
        }) 

        return res.status(201).json({
            success: true,
            message: "Flashcards generated successfully",
            data: flashcardSet
        })
        
    } catch (error) {
        next(error)
    }
}

export const generateQuiz = async (req, res, next) => {
    try {
        const {documentId, numQuestions=10, title} = req.body;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status:'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not ready",
                statusCode: 404
            })
        }

        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions),
        );
        
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            questions,
            title: title || `${document.title} - Quiz`,
            totalQuestions: questions.length,
            score:0,
        })

        return res.status(201).json({
            success: true,
            message: "Quiz generated successfully",
            data: quiz
        })
    } catch (error) {
        next(error)
    }
}

export const generateSummary = async (req, res, next) => {
    try {
        const {documentId} = req.body;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status:'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not ready",
                statusCode: 404
            })
        }

        const summary = await geminiService.generateSummary(document.extractedText);

        return res.status(201).json({
            success: true,
            data: {
                title: document.title,
                summary,
            },
            message: "Summary generated successfully",
        })
    } catch (error) {
        next(error)
    }
}

export const chat = async (req, res, next) => {
    try {
        const {documentId, question} = req.body;

        if(!documentId || !question) {
            return res.status(400).json({
                success: false,
                message: "Document ID and question are required",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status:'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not ready",
                statusCode: 404
            })
        }

       const relevantChunks = findRelevantChunks(document.chunks, question, 3);
       const chunkIndices = relevantChunks.map(c => c.chunkIndex);

       let chatHistory = await ChatHistory.findOne({
           documentId: document._id,
           userId: req.user._id,
       })

       if(!chatHistory) {
           chatHistory = await ChatHistory.create({
               documentId: document._id,
               userId: req.user._id,
               messages: [],
           })
       }


       const answer = await geminiService.chatWithContext(question, relevantChunks);

       chatHistory.messages.push(
        {
           role: "user",
           content: question,
           timestamp: new Date(),
           relevantChunks:[]
       },
       {
           role: "assistant",
           content: answer,
           timestamp: new Date(),
           relevantChunks: chunkIndices,
       }
    )

       await chatHistory.save();

       return res.status(200).json({
           success: true,
           data: {
               question,
               answer,
               relevantChunks: chunkIndices,
               chatHistoryId: chatHistory._id,
           },
           message: "Chat completed successfully",
       })
    } catch (error) {
        next(error)
    }
}

export const explainConcept = async (req, res, next) => {
    try {
        const {documentId, concept} = req.body;

        if(!documentId || !concept) {
            return res.status(400).json({
                success: false,
                message: "Document ID and concept are required",
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status:'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found or not ready",
                statusCode: 404
            })
        }

        const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
        const context = relevantChunks.map(c => c.chunkIndex).join("\n\n");

        const explaination = await geminiService.explainConcept(concept, context);

        return res.status(200).json({
            success: true,
            data: {
                concept,
                explaination,
                relevantChunks: relevantChunks.map(c => c.chunkIndex),
            },
            message: "Concept explained successfully",
        })
        
    } catch (error) {
        next(error)
    }
}


export const getChatHistory = async (req, res, next) => {
    try {
        const {documentId} = req.params;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required",
                statusCode: 400
            })
        }

        const chatHistory = await ChatHistory.findOne({
            documentId: documentId,
            userId: req.user._id,
        }).select("messages")

        if(!chatHistory) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "Chat history not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: chatHistory,
            message: "Chat history retrieved successfully",
        })

        
    } catch (error) {
        next(error)
    }
}