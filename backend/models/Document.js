import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true,"Please enter a title"],
    },
    filename: {
        type: String,
        required: [true,"Please enter a filename"],
    },
    filePath: {
        type: String,
        required: [true,"Please enter a file path"],
    },
    fileSize: {
        type: Number,
        required: [true,"Please enter a file size"],
    },
    extractedText:{
        type: String,
        default: "",
    },
    chunks:[{
        content:{
            type:String,
            required:true,
        },
        pageNumber:{
            type:Number,
            default:0,
        },
        chunkNumber:{
            type:Number,
            required:true,
        } 
    }],
    uploadDate:{
        type:Date,
        default:Date.now,
    },
    lastAccessedAt:{
        type:Date,
        default:Date.now,
    },
    status:{
        type:String,
        enum:["processing","ready","failed"],
        default:"processing",
    },
},{timestamps: true})

documentSchema.index({userId:1, uploadDate:-1})

const Document = mongoose.model("Document", documentSchema);

export default Document;


