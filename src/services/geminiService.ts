import { GoogleGenAI, Type } from "@google/genai";
import type { CareerAnalysis, CareerPath, Summary } from '../types';

// Lazy client initializer to avoid crashing the app at startup if API key is missing.
// Reads key from Vite env (VITE_API_KEY). Fails gracefully only when an API call is attempted.
let cachedClient: GoogleGenAI | null = null;
const getClient = (): GoogleGenAI => {
    if (cachedClient) return cachedClient;
    const apiKey = (import.meta as any).env?.VITE_API_KEY as string | undefined;
    if (!apiKey) {
        throw new Error("Missing API key. Please set VITE_API_KEY in your .env file.");
    }
    cachedClient = new GoogleGenAI({ apiKey: apiKey! });
    return cachedClient;
};

const baseSystemInstruction = `You are PathGenX AI, a career copilot specializing in the Indian job market. Your goal is to provide detailed, structured analysis of career and entrepreneurial pathways. All financial projections must be in Indian Rupees (e.g., '₹12 LPA'). Your entire response must be a single, valid JSON object that strictly adheres to the provided schema. Do not output any text outside of the JSON object.`;

const resourceItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Resource name." },
        url: { type: Type.STRING, description: "Resource URL." }
    },
    required: ["name", "url"]
};

const summarySchema = {
    type: Type.OBJECT,
    properties: {
        keyTakeaways: {
            type: Type.ARRAY,
            description: "2-3 key comparison points.",
            items: { type: Type.STRING }
        },
        bestForStability: {
            type: Type.STRING,
            description: "Recommendation for stability."
        },
        bestForGrowth: {
            type: Type.STRING,
            description: "Recommendation for growth."
        },
        finalVerdict: {
            type: Type.STRING,
            description: "Final synthesized advice."
        }
    },
    required: ["keyTakeaways", "bestForStability", "bestForGrowth", "finalVerdict"]
};

const careerPathProperties = {
    title: {
        type: Type.STRING,
        description: "Path title (e.g., 'Corporate Software Engineer')."
    },
    description: {
        type: Type.STRING,
        description: "One-sentence summary of the path."
    },
    incomeProjection: {
        type: Type.OBJECT,
        properties: {
            year1: { type: Type.STRING, description: "Year 1 projected annual income (e.g., '₹12 LPA')." },
            year3: { type: Type.STRING, description: "Year 3 projected annual income." },
            year5: { type: Type.STRING, description: "Year 5 projected annual income." }
        },
        required: ["year1", "year3", "year5"]
    },
    skillsToDevelop: {
        type: Type.ARRAY,
        description: "List of 3-5 key skills.",
        items: { type: Type.STRING }
    },
    stressLevel: {
        type: Type.INTEGER,
        description: "Stress level (1-10)."
    },
    longTermUpside: {
        type: Type.STRING,
        description: "Description of long-term potential."
    },
    recommendation: {
        type: Type.STRING,
        description: "Why this path is a good fit."
    },
    roadmap: {
        type: Type.ARRAY,
        description: "3-step roadmap (years 1, 3, 5).",
        items: {
            type: Type.OBJECT,
            properties: {
                year: { type: Type.INTEGER, description: "Roadmap year (1, 3, or 5)." },
                title: { type: Type.STRING, description: "Milestone title." },
                description: { type: Type.STRING, description: "Milestone goal description." },
                skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key skills for this period." }
            },
            required: ["year", "title", "description", "skills"]
        }
    },
    pros: {
        type: Type.ARRAY,
        description: "List of 2-3 pros.",
        items: { type: Type.STRING }
    },
    cons: {
        type: Type.ARRAY,
        description: "List of 2-3 cons.",
        items: { type: Type.STRING }
    },
    resources: {
        type: Type.OBJECT,
        description: "Curated learning resources.",
        properties: {
            books: { type: Type.ARRAY, description: "2-3 recommended books.", items: resourceItemSchema },
            courses: { type: Type.ARRAY, description: "2-3 recommended online courses.", items: resourceItemSchema },
            tools: { type: Type.ARRAY, description: "2-3 essential tools/software.", items: resourceItemSchema },
            other: { type: Type.ARRAY, description: "2-3 other resources (blogs, communities).", items: resourceItemSchema }
        },
        required: ["books", "courses", "tools", "other"]
    },
    industryTrends: {
        type: Type.STRING,
        description: "Current industry trends impacting this path."
    },
};

// Fix: Replaced stream processing with a simple JSON parser for non-streaming responses.
// This aligns with guidelines for JSON mode, which recommends using `generateContent`
// and extracting the complete JSON from `response.text`.
const parseJsonResponse = (responseText: string): any => {
    // The response can sometimes include markdown backticks, which need to be removed.
    const jsonText = responseText.trim().replace(/^```json/, '').replace(/```$/, '');
    if (jsonText.startsWith('{') || jsonText.startsWith('[')) {
        try {
            return JSON.parse(jsonText);
        } catch (e) {
            console.error("Failed to parse JSON:", jsonText, e);
            throw new Error("The AI returned a response in an unexpected format. Please try again or rephrase your request.");
        }
    }
    throw new Error("The AI returned an empty or invalid response. Please try again.");
};


// --- API Function 1: Get Path Outlines (Fast) ---
export const generatePathOutlines = async (query: string): Promise<{ paths: Pick<CareerPath, 'title' | 'description'>[] }> => {
    const outlinesSchema = {
        type: Type.OBJECT,
        properties: {
            paths: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: careerPathProperties.title,
                        description: careerPathProperties.description,
                    },
                    required: ["title", "description"]
                }
            },
        },
        required: ["paths"]
    };

    const prompt = `${baseSystemInstruction}\n\nAnalyze this user's career dilemma: "${query}". Generate 2-3 distinct career/entrepreneurial pathways. For each path, provide ONLY a title and a one-sentence description.`;

    try {
        // Fix: Use `generateContent` instead of `generateContentStream` for a complete JSON response.
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: outlinesSchema,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty response from AI.");
        }
        return parseJsonResponse(text);
    } catch (error: any) {
        console.error("Error in generatePathOutlines:", error);
        const msg = String(error?.message || error);
        if (msg.includes('Missing API key')) {
            throw new Error("Missing API key. Set VITE_API_KEY in your .env and restart the dev server.");
        }
        if (msg.includes('401')) {
            throw new Error("Authentication failed. Check that VITE_API_KEY is valid and has access.");
        }
        if (msg.includes('429')) {
            throw new Error("Rate limit reached. Please wait and try again.");
        }
        throw new Error(msg || "Failed to generate initial career pathways.");
    }
};

// --- API Function 2: Get Details for a Single Path ---
export const generatePathDetails = async (path: { title: string, description: string }, originalQuery: string): Promise<Omit<CareerPath, 'id' | 'title' | 'description'>> => {
    const detailsSchema = {
        type: Type.OBJECT,
        properties: {
            incomeProjection: careerPathProperties.incomeProjection,
            skillsToDevelop: careerPathProperties.skillsToDevelop,
            stressLevel: careerPathProperties.stressLevel,
            longTermUpside: careerPathProperties.longTermUpside,
            recommendation: careerPathProperties.recommendation,
            roadmap: careerPathProperties.roadmap,
            pros: careerPathProperties.pros,
            cons: careerPathProperties.cons,
            resources: careerPathProperties.resources,
            industryTrends: careerPathProperties.industryTrends,
        },
        required: ["incomeProjection", "skillsToDevelop", "stressLevel", "longTermUpside", "recommendation", "roadmap", "pros", "cons", "resources", "industryTrends"]
    };

    const prompt = `${baseSystemInstruction}\n\nThe user's original dilemma was: "${originalQuery}".
    I need a detailed breakdown for the career path titled "${path.title}", which is described as "${path.description}".
    Generate the full details for this path. Do NOT include the title or description in your response. Provide only the detailed properties as per the schema.`;

    try {
        // Fix: Use `generateContent` instead of `generateContentStream` for a complete JSON response.
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: detailsSchema,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty response from AI.");
        }
        return parseJsonResponse(text);
    } catch (error: any) {
        console.error(`Error generating details for "${path.title}":`, error);
        const msg = String(error?.message || error);
        if (msg.includes('Missing API key')) {
            throw new Error("Missing API key. Set VITE_API_KEY in your .env and restart the dev server.");
        }
        if (msg.includes('401')) {
            throw new Error("Authentication failed. Check that VITE_API_KEY is valid and has access.");
        }
        if (msg.includes('429')) {
            throw new Error("Rate limit reached. Please wait and try again.");
        }
        throw new Error(`Failed to generate details for ${path.title}. ${msg}`.trim());
    }
};

// --- API Function 3: Generate Summary from Completed Paths ---
export const generateSummary = async (paths: CareerPath[], originalQuery: string): Promise<Summary> => {
    const prompt = `${baseSystemInstruction}\n\nUser's Dilemma: "${originalQuery}".
    Based on the following fully-detailed career paths, create a final summary. Provide a structured summary object with key takeaways, recommendations for stability and growth, and a final verdict.
    Paths for context (use this info for comparison):
    ${JSON.stringify(paths.map(p => ({ 
        title: p.title, 
        description: p.description, 
        pros: p.pros, 
        cons: p.cons, 
        incomeProjection: p.incomeProjection, 
        longTermUpside: p.longTermUpside 
    })))}`;
    
    try {
        // Fix: Use `generateContent` instead of `generateContentStream` for a complete JSON response.
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: summarySchema,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty response from AI.");
        }
        return parseJsonResponse(text);
    } catch (error: any) {
        console.error("Error in generateSummary:", error);
        const msg = String(error?.message || error);
        if (msg.includes('Missing API key')) {
            throw new Error("Missing API key. Set VITE_API_KEY in your .env and restart the dev server.");
        }
        if (msg.includes('401')) {
            throw new Error("Authentication failed. Check that VITE_API_KEY is valid and has access.");
        }
        if (msg.includes('429')) {
            throw new Error("Rate limit reached. Please wait and try again.");
        }
        throw new Error("Could not generate the final AI summary. " + msg);
    }
};


// --- API Function 4: Refine Existing Analysis ---
export const refineCareerPaths = async (
  feedback: string,
  context: { previousAnalysis: CareerAnalysis; originalQuery: string }
): Promise<CareerAnalysis> => {
    const refinementSchema = {
        type: Type.OBJECT,
        properties: {
            paths: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        ...careerPathProperties,
                        // Allow optional new fields during refinement
                        dayInTheLife: { type: Type.STRING },
                        workLifeBalance: { type: Type.STRING },
                        certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                        networking: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["title", "description", "incomeProjection", "skillsToDevelop", "stressLevel", "longTermUpside", "recommendation", "roadmap", "pros", "cons", "resources", "industryTrends"]
                }
            },
            summary: summarySchema
        },
        required: ["paths", "summary"]
    };
    
    const contextSummary = {
      summary: context.previousAnalysis.summary,
      paths: context.previousAnalysis.paths.map(p => ({
        title: p.title,
        description: p.description,
        longTermUpside: p.longTermUpside
      }))
    };

    const prompt = `${baseSystemInstruction}\n\nUser's Initial Dilemma: "${context.originalQuery}".
    Here is a summary of the current analysis you have provided: ${JSON.stringify(contextSummary)}.
    Now, the user has a new request: "${feedback}".
    Based on this new request, generate a new, complete JSON analysis that incorporates the changes. For example, if the user asks to "add a day in the life", add that field to all paths. If they ask to remove a path, generate a new analysis without it. Your response must be the full JSON object adhering to the schema, including all original fields plus any new ones requested.`;

    try {
        // Fix: Use `generateContent` instead of `generateContentStream` for a complete JSON response.
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: refinementSchema,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty response from AI.");
        }
        return parseJsonResponse(text);
    } catch (error: any) {
        console.error("Error refining career paths:", error);
        const msg = String(error?.message || error);
        if (msg.includes('Missing API key')) {
            throw new Error("Missing API key. Set VITE_API_KEY in your .env and restart the dev server.");
        }
        if (msg.includes('401')) {
            throw new Error("Authentication failed. Check that VITE_API_KEY is valid and has access.");
        }
        if (msg.includes('429')) {
            throw new Error("Rate limit reached. Please wait and try again.");
        }
        throw new Error("Could not apply your feedback to refine the analysis. " + msg);
    }
};