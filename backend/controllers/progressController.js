import Document from "../models/Document.js"
import Quiz from "../models/Quiz.js"
import Flashcard from "../models/Flashcards.js"


export const getDashboard = async (req, res, next) => {
    try {

        const userId = req.user._id;

        //Get Counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({ userId, completed: {$ne: null} });

        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(card => card.isStarred).length;
        });

        const quizzes = await Quiz.find({userId, completedAt: {$ne: null}})
        const averageScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
        : 0;

        const recentDocuments = await Document.find({userId})
        .sort({createdAt: -1})
        .limit(5)
        .select("title fileName lastAccessed status");

        const recentQuizzes = await Quiz.find({userId})
        .sort({createdAt: -1})
        .limit(5)
        .populate("documentId", "title")
        .select("title score totalQuestions createdAt");

        const studyStreak = Math.floor(Math.random() * 7) + 1;

        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalQuizzes,
                    totalFlashcardSets,
                    completedQuizzes,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    averageScore,
                    recentDocuments,
                    recentQuizzes,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes,
                }
            }
        })
        
    } catch (error) {
        next(error)
    }
}