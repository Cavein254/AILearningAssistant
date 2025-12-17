import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    documentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    questions:[{
       question: {
         type: String,
         required: true,
       },
       options: {
        type:[String],
        required: true,
        validate:[array => array.length === 4, "Options must have exactly 4 options"]
       },
       correctAnswer: {
        type: String,
        required: true,
       },
       explanation:{
        type: String,
        default: "",
       }
    }],
    userAnswers:[{
        questionindex: {
            type: Number,
            required: true,
        },
        selectedAnswer: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        answerAt:{
            type: Date,
            default: Date.now,
        }       
    }],
    score: {
        type: Number,
        default:0,
    },
    totalQuestions: {
        type: Number,
        default:0,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true})

quizSchema.index({userId: 1, documentId: 1}, {unique: true})

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
