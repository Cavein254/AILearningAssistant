import dotenv from "dotenv";
import {GoogleGenAI} from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

if(!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined");
    process.exit(1);
}


export const generateFlashcards = async (text, count=10) => {
    const prompt = `Generate ${count} educational flashcards for the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Clear, specific answer]
    D: [Difficulty level: easy, medium, hard]

    Separate each flashcard with "---".

    Text:
    ${text.substring(0,15000)}
    
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const generatedText = response.text;


        const flashcards = [];
        const cards = generatedText.split("---").filter(c => c.trim() !== "");

        for (const card of cards) {
            const lines = card.trim().split("\n");
            let question = "";
            let answer = "";
            let difficulty = "medium";

            for (const line of lines) {
                if (line.startsWith("Q:")) {
                    question = line.substring(2).trim();
                } else if (line.startsWith("A:")) {
                    answer = line.substring(2).trim();
                } else if (line.startsWith("D:")) {
                    difficulty = line.substring(2).trim().toLowerCase();
                    if(['easy', 'medium', 'hard'].includes(difficulty)) {
                        difficulty = difficulty;
                    }
                }
            }
            
            if(question && answer) {
                flashcards.push({
                    question,
                    answer,
                    difficulty,
                });
            }
        }
        
        return flashcards.slice(0,count)
    } catch (error) {
        console.error('Gemini API error', error)
        throw new Error('Failed to generate flashcards')
    }
}

export const generateQuiz = async (text, numQuestions=5) => {
    const prompt = `Generate exactly ${numQuestions} multiple choicequestions for the following text.
    Format each question as:
    Q: [Question]
    01: [Option]
    02: [Option]
    03: [Option]
    04: [Option]
    C: [Correct Option - exactly as written above]
    E: [Brief explanation of why this is the correct answer]
    D: [Difficulty: easy, medium, hard]
    
    Separate each question with "---".
    
    Text:
    ${text.substring(0,15000)}
    `
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;

        const questions = [];
        const questionBlocks = generatedText.split("---").filter(q => q.trim());

        for(const block of questionBlocks) {
            const lines = block.trim().split("\n");
            let question = "";
            let options = [];
            let correctAnswer = "";
            let explanation = "";
            let difficulty = "medium";

            for(const line of lines) {
                if(line.startsWith("Q:")) {
                    question = line.substring(2).trim();
                } else if(line.startsWith("01:")) {
                    options.push(line.substring(3).trim());
                } else if(line.startsWith("02:")) {
                    options.push(line.substring(3).trim());
                } else if(line.startsWith("03:")) {
                    options.push(line.substring(3).trim());
                } else if(line.startsWith("04:")) {
                    options.push(line.substring(3).trim());
                } else if(line.startsWith("C:")) {
                    correctAnswer = line.substring(2).trim();
                } else if(line.startsWith("E:")) {
                    explanation = line.substring(2).trim();
                } else if(line.startsWith("D:")) {
                    difficulty = line.substring(2).trim().toLowerCase();
                    if(['easy', 'medium', 'hard'].includes(difficulty)) {
                        difficulty = difficulty;
                    }
                }
            }

            if(question && options.length === 4 && correctAnswer) {
                questions.push({
                    question,
                    options,
                    correctAnswer,
                    explanation,
                    difficulty,
                });
            }
        }
        
        return questions.slice(0, numQuestions);
    } catch (error) {
        console.error('Gemini API error', error)
        throw new Error('Failed to generate quiz')
    }
}


export const generateSummary = async (text) => {
    const prompt = `provide a concise summary of the following text, highlighting the key concepts,
    main ideas, and any important details. Keep the summary clear and structured.
    
    Text:
    ${text.substring(0, 20000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const geneatedText = response.text;

        return geneatedText;
    } catch (error) {
        console.error('Gemini API error', error)
        throw new Error('Failed to generate summary')
    }
}


export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c,i) => `[Chunk ${i+1}]\n${c.content}`).join("\n\n");

    const prompt = `You are a helpful assistant that can answer questions based on the provided context.
    
    Context:
    ${context}
    
    Question:
    ${question}
    
    
    Answer:
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const geneatedText = response.text;

        return geneatedText;
    } catch (error) {
        console.error('Gemini API error', error)
        throw new Error('Failed to generate answer')
    }
}

export const explainConcept = async (concept) => {
    const prompt = `Explain the concept of "${concept}" based on the following context.
    Provide a clear, educational relevantexplanation that is easy to understand and structured manner.
    Include any relevant examples or real-world applications.
    
    Context:
    ${concept.substring(0, 15000)}
    
    Explanation:
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const geneatedText = response.text;

        return geneatedText;
    } catch (error) {
        console.error('Gemini API error', error)
        throw new Error('Failed to explain concept')
    }
}
