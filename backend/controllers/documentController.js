import mongoose from "mongoose";
import Document from "../models/Document.js";
import  Flashcard from "../models/Flashcards.js";
import Quiz from "../models/Quiz.js";
import {extractTextFromPDF} from "../utils/pdfParser.js";
import {chunkText} from "../utils/textChunker.js";
import fs from "fs/promises";


export const uploadDocument = async (req, res, next) => {
    console.log(req.file);
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
                statusCode: 400,
            })
        }

        const baseUrl = `http:\\localhost:${process.env.PORT || 5000}`;
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title: req.body.title,
            filename: req.file.originalname,
            filePath:fileUrl,
            fileSize: req.file.size,
            status: "processing",
        }) 

        processPDF(document._id, req.file.path).catch((error) => {
            console.error("Error processing PDF:", error);
        })

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            statusCode: 201,
            data: document,
        })
    }catch(error){
        if(req.file){
            await fs.unlink(req.file.path).catch(() => {})
        }
        next(error);
    }
}


const processPDF = async (documentId, filePath) => {
    try{
        const { text } = await extractTextFromPDF(filePath);

        const chunks = chunkText(text, 500, 50);

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            status: "ready",
            chunks: chunks,
        })
        console.log(`Document processed successfully: ${documentId}`)
    }catch(error){
        console.error(`Error processing PDF ${documentId}:`, error);

        await Document.findByIdAndUpdate(documentId, {
            status: "failed",
        })
    }
}


export const getDocuments = async (req, res, next) => {
    try{
        const documents = await Document.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user._id),
                }
            },
            {
                $lookup: {
                    from: "flashcards",
                    localField: "_id",
                    foreignField: "documentId",
                    as: "flashcards",
                }
            },
            {
               $lookup: {
                   from: "quizzes",
                   localField: "_id",
                   foreignField: "documentId",
                   as: "quizzes",
               }
            },
            {
                $addFields: {
                    flashcardCount: { $size: "$flashcards" },
                    quizCount: { $size: "$quizzes" },
                }
            },
            {
                $project: {
                    extractedText: 0,
                    chunks: 0,
                    flashcards: 0,
                    quizzes: 0,
                }
            },
            {
                $sort: { uploadAt: -1 }
            }
        ])

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents,
        })
    }catch(error){
        next(error);
    }
}

export const getDocument = async (req, res, next) => {
    try{
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        if(!document){
            return res.status(404).json({
                success: false,
                message: "Document not found",
                statusCode: 404,
            })
        }

        const [flashcardCount, quizCount] = await Promise.all([
            Flashcard.countDocuments({ documentId: document._id, userId: req.user._id }),
            Quiz.countDocuments({ documentId: document._id, userId: req.user._id })
        ]);

        await Document.updateOne(
            { _id: document._id },
            { $set: { lastAccessedAt: new Date() } }
        );

        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        return res.status(200).json({
            success: true,
            data: documentData,
        })
    }catch(error){
        next(error);
    }
}

export const deleteDocument = async (req, res, next) => {
    try{
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        if(!document){
            return res.status(404).json({
                success: false,
                message: "Document not found",
                statusCode: 404,
            })
        }

        await fs.unlink(document.filePath).catch(() => {})

        await document.deleteOne();

        await Flashcard.deleteMany({
            documentId: document._id,
            userId: req.user._id,
        })

        await Quiz.deleteMany({
            documentId: document._id,
            userId: req.user._id,
        })

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully",
            statusCode: 200,
        })
    }catch(error){
        next(error);
    }
}

