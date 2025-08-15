import { GoogleGenAI, Type } from "@google/genai";
import { FRONT_END_DOMAIN, GOOGLE_GENAI_API_KEY } from "../constants.js";

const ai = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

export async function callAIToGetRatingAndInsight(lead) {
    try {
        const prompt = `
        You are an AI assistant helping a career-training company that teaches people how to become software developers.
        Your task is to evaluate a lead and return:
        
        1. A **leadScore** from 0 to 100 (integer only) based on their likelihood to successfully enroll and complete the program.
           - Give **higher scores** to leads who have:
             • Background in Computer Science, IT, or related fields  
             • Experience in coding (even beginner-level)  
             • Strong motivation or interest in becoming a software developer  
             • Relevant education or certifications  
           - Lower scores for:
             • No interest in software development  
             • Irrelevant background and no transferable skills  
             • Low expressed motivation  
           - Make it **hard to score above 80** — only highly qualified & motivated leads should reach that range.
        
        2. A **short, actionable insight** (20–30 words) summarizing why the lead is promising or what the sales team should focus on when approaching them.
        
        Lead details:
        Name: ${lead.name}
        Role: ${lead.role}
        Age: ${lead.age}
        Company: ${lead.company}
        Industry: ${lead.industry || "N/A"}
        Lead Source: ${lead.leadSource || "N/A"}
        Interested In: ${lead.interestedIn || "N/A"}
        Category: ${lead.category || "N/A"}
        Experience: ${lead.experience} years
        Location: ${lead.location || "N/A"}

        Respond **strictly** as JSON:
        {
            "leadScore": number,
            "insight": string
        }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        leadScore: { type: Type.NUMBER },
                        insight: { type: Type.STRING },
                    },
                    required: ["leadScore", "insight"],
                    propertyOrdering: ["leadScore", "insight"],
                },
            },
        });

        const parsed = JSON.parse(response.text);

        return {
            leadScore: parsed.leadScore || 0,
            insight: parsed.insight || "",
        };

    } catch (error) {
        console.error("Gemini API error:", error);
        return {
            leadScore: 0,
            insight: "",
        };
    }
}

export const generateEmailDraft = async (lead) => {
    try {
        const prompt = `
        You are an expert B2B sales outreach writer.
        You are a creative writer specializing in vibrant and engaging language. 
        Generate a short paragraph (3–5 sentences) that is visually and emotionally colorful. 
        Use descriptive adjectives, playful metaphors, and imagery that evokes colors, light, and texture. 
        Make the text lively, exciting, and vivid, suitable for catching attention in a blog, social media post, or banner. 
        Do not include HTML or color codes—focus purely on colorful language.

        Based on the following lead details, write:
        1. A short, engaging subject line for a cold outreach email.
        2. A personalized, concise body (50–100 words) introducing our company and offering value, based on the insight provided.

        Lead details:
        Name: ${lead.name}
        Role: ${lead.role}
        Company: ${lead.company}
        Age: ${lead.age}
        industry: ${lead.industry || "N/A"}
        leadSource: ${lead.leadSource || "N/A"}
        interestedIn: ${lead.interestedIn || "N/A"}
        category: ${lead.category || "N/A"}
        Experience: ${lead.experience} years
        location: ${lead.location || "N/A"}
        Insight: ${lead.insight || "No insight available"}
        leadScore: ${lead.leadScore}

        Return strictly as JSON with:
        {
            "subject": string,
            "body": string
        }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING },
                    },
                    required: ["subject", "body"],
                    propertyOrdering: ["subject", "body"],
                },
            },
        });

        const parsed = JSON.parse(response.text);
        const meetingLink = `\n\nIf you'd like to discuss further, please confirm here: ${FRONT_END_DOMAIN}/meeting/ready/${lead._id}`;
        return {
            subject: parsed.subject || "Hello from Our Company",
            body: (parsed.body || "Hi, we wanted to connect and explore potential opportunities.") + meetingLink,
        };
    } catch (error) {
        console.error("Gemini Email Draft error:", error);
        return {
            subject: "Hello from Our Company",
            body: "Hi, we wanted to connect and explore potential opportunities.",
        };
    }
}

export const generateFollowUpEmail = async (lead) => {
    try {
        const prompt = `
            You are an expert B2B sales follow-up writer. 

            Write a **vibrant, engaging, and visually appealing follow-up email**. Use **rich text formatting** including bold, italics, bullet points, and emojis to make the email stand out. Keep it professional, friendly, and eye-catching.

            Requirements:
            1. Generate a **short, attention-grabbing subject line** for a follow-up email (second contact after initial outreach).  
            2. Generate a **personalized email body** (50–100 words) that:  
            - References the previous outreach politely (without sounding pushy)  
            - Restates the value proposition clearly  
            - Encourages the lead to respond or schedule a meeting  
            - Uses **bold** for key points, *italics* for emphasis, and emojis sparingly for visual interest  
            - Can include bullet points to highlight benefits or features  

            Lead details:  
            Name: ${lead.name}  
            Role: ${lead.role}  
            Company: ${lead.company}  
            Age: ${lead.age}  
            Industry: ${lead.industry || "N/A"}  
            Lead Source: ${lead.leadSource || "N/A"}  
            Interested In: ${lead.interestedIn || "N/A"}  
            Category: ${lead.category || "N/A"}  
            Experience: ${lead.experience} years  
            Location: ${lead.location || "N/A"}  
            Insight: ${lead.insight || "No insight available"}  
            Lead Score: ${lead.leadScore}  

            Return strictly as JSON:  
            {
            "subject": string,
            "body": string
            }
            `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING },
                    },
                    required: ["subject", "body"],
                    propertyOrdering: ["subject", "body"],
                },
            },
        });

        const parsed = JSON.parse(response.text);
        const meetingLink = `\n\nIf you'd like to discuss further, please confirm here: ${FRONT_END_DOMAIN}/meeting/ready/${lead._id}`;
        return {
            subject: parsed.subject || "Following Up on My Previous Email",
            body: (parsed.body || "Just checking in to see if you had a chance to review my previous message.") + meetingLink,
        };
    } catch (error) {
        console.error("Gemini Email Draft error:", error);
        return {
            subject: "Following Up on My Previous Email",
            body: "Just checking in to see if you had a chance to review my previous message.",
        };
    }
}