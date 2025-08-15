import cron from "node-cron";
import { LeadModel } from "../models/leads.model.js";
import { callAIToGetRatingAndInsight } from "../utils/ai.service.js";
import { EmailModel } from "../models/email.model.js";
import { generateEmailDraft } from "../utils/ai.service.js";
import { mailer } from "../utils/email.service.js";


const processLeads = async () => {
    console.log("⏳ Running AI enrichment job...");

    try {
        const leadsToProcess = await LeadModel.find({
            $or: [
                { leadScore: { $exists: false } },
                { leadScore: 0 },
                { insight: { $exists: false } },
                { insight: "" }
            ]
        }).limit(20).sort({ createdAt: 1 });

        if (leadsToProcess.length === 0) {
            console.log(`✅ No leads to process. ${new Date}`);
            return;
        }

        console.log(`📌 Found ${leadsToProcess.length} leads to process.`);

        for (const lead of leadsToProcess) {
            try {
                const { leadScore, insight } = await callAIToGetRatingAndInsight(lead);

                lead.leadScore = leadScore;
                lead.insight = insight;
                await lead.save();

                console.log(`✅ Processed lead ${lead._id}`);
            } catch (err) {
                console.error(`❌ Failed to process lead ${lead._id}:`, err.message);
            }
        }

        console.log(`🏁 AI enrichment job finished. ${new Date}`);
    } catch (error) {
        console.error("🚨 Job error:", error.message);
    }
}

const draftEmail = async () => {
    console.log("📨 Draft Email Cron Started");

    try {
        const leads = await LeadModel.find({
            status: "new",
            checked: true
        }).limit(20);

        if (leads.length === 0) {
            console.log(`✅ No new leads to draft emails for. ${new Date()}`);
            return;
        }

        for (const lead of leads) {
            const existingDraft = await EmailModel.findOne({
                leadId: lead._id,
            });

            if (existingDraft) continue;

            const { subject, body } = await generateEmailDraft(lead);

            await EmailModel.create({
                leadId: lead._id,
                leadEmail: lead.email,
                subject,
                body
            });

            console.log(`✏️ Drafted email for lead ${lead._id}`);
        }
        console.log(`🏁 AI drafting for email job finished. ${new Date()}`);
    } catch (err) {
        console.error("❌ Draft Email Cron Error:", err.message);
    }
}

const sendEmail = async () => {
    console.log("📤 Running email send cron...");

    try {
        const emails = await EmailModel.find({ status: "pending" }).limit(20);

        if (emails.length === 0) {
            console.log(`✅ No emails to send. ${new Date()}`);
            return;
        }

        for (const email of emails) {
            try {
                const lead = await LeadModel.findById(email.leadId);
                if (!lead) {
                    console.warn(`⚠️ Lead not found for email ${email._id}`);
                    continue;
                }

                await mailer({
                    to: lead.email,
                    subject: email.subject,
                    text: email.body
                });

                email.status = "sent";
                email.nextMailDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    await email.save();

                lead.status = "contacted";
                await lead.save();

                console.log(`📧 Sent email to ${lead.email}`);
            } catch (err) {
                console.error(`❌ Failed to send email ${email._id}:`, err.message);
            }
        }
        console.log(`📤 Finished sending Outreach emails at ${new Date()}`);
    } catch (error) {
        console.error("🚨 Send email cron error:", error.message);
    }
}

let isRunning = false


export const handleNewLeadsCron = async () => {
    if (isRunning) {
        console.log("⚠️ Skipping handleNewLeads cron — already running");
        return;
    }

    isRunning = true;

    try {
        await processLeads();
        await draftEmail();
        await sendEmail();

    } catch (error) {
        console.error("🚨 Handle new leads cron error:", error.message);
    }
    finally {
        isRunning = false;
    }
}

handleNewLeadsCron()
cron.schedule("*/5 * * * *", handleNewLeadsCron);