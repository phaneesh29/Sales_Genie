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
        You are a friendly SaaS founder writing a cold outreach email.
        Write in a warm, approachable tone that feels personal and human — similar to how a startup founder might personally welcome a new user.

        Output Requirements:
        - Return the "body" as valid HTML, not plain text.
        - Use <p>, <strong>, <em>, and <ul>/<li> for formatting.
        - Keep it professional but friendly.

        Structure:
        1. Start with a friendly greeting using the lead’s name if available.
        2. Briefly introduce yourself as "Madwa" and your role (founder, co-founder, etc.) at SaaratiLead.
        3. Give a quick overview of what our company does in 2–3 sentences, keeping it engaging and easy to understand.
        4. Provide a short step-by-step or "how it works" section (bullet points allowed).
        5. End with an invitation to reply or click a meeting link.

        Length: 80–120 words total.
        Avoid heavy marketing fluff — make it sound genuine and conversational.

        Company: Our Company
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
            "body": string // HTML formatted string
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

        Write a vibrant, engaging, and visually appealing follow-up email in **HTML** format.  
        Use:
        - <b> for bold
        - <i> for italics
        - <ul> and <li> for bullet points
        - Emojis sparingly for visual interest

        Requirements:
        1. Generate a short, attention-grabbing subject line for a follow-up email (second contact after initial outreach).
        2. Generate a personalized HTML email body (50–100 words) that:
        - References the previous outreach politely (without sounding pushy)
        - Restates the value proposition clearly
        - Encourages the lead to respond or schedule a meeting
        - Uses the HTML tags mentioned for emphasis
        - Includes bullet points to highlight benefits or features

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

        Return the result strictly as valid JSON with the following format and no extra text:
        {
        "subject": "string - short subject line",
        "body": "string - HTML email body"
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