import cron from "node-cron";
import { EmailModel } from "../models/email.model.js";
import { LeadModel } from "../models/leads.model.js";
import { generateFollowUpEmail } from "../utils/ai.service.js";
import { mailer } from "../utils/email.service.js";

const markFollowUp = async () => {
    console.log(`🔍 Checking for leads that need follow-up... ${new Date()}`);

    try {
        const now = new Date();
        const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000); // next 24 hrs

        const emailsDue = await EmailModel.find({
            nextMailDate: { $lte: cutoff },
            status: "sent"
        });

        if (emailsDue.length === 0) {
            console.log(`✅ No emails due for follow-up. ${new Date()}`);
            return;
        }

        for (const email of emailsDue) {
            const lead = await LeadModel.findById(email.leadId);
            if (!lead) continue;

            if (lead.status !== "follow-up") {
                lead.status = "follow-up";
                await lead.save();
                console.log(`📌 Marked lead ${lead._id} for follow-up`);
            }
        }
    } catch (err) {
        console.error("❌ Error marking follow-ups:", err.message);
    }
};

const followUpEmail = async () => {
    console.log("📨 Follow up Email Cron Started");

    try {
        const leads = await LeadModel.find({
            status: "follow-up"
        }).limit(20);

        if (leads.length === 0) {
            console.log(`✅ No leads to follow up. ${new Date()}`);
            return;
        }

        for (const lead of leads) {
            const existingDraft = await EmailModel.findOne({
                leadId: lead._id,
            });

            if (!existingDraft) {
                console.log(`⚠️ No existing draft found for lead ${lead._id}, skipping follow-up.`);
                continue;
            }

            const { subject, body } = await generateFollowUpEmail(lead);

            existingDraft.subject = subject;
            existingDraft.body = body;
            existingDraft.status = "pending";
            existingDraft.nextMailDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

            await existingDraft.save();

            console.log(`✏️ Follow up email for lead ${lead._id}`);
        }
        console.log(`🏁 AI Follow up for email job finished. ${new Date()}`);
    } catch (err) {
        console.error("❌ Follow up Email Cron Error:", err.message);
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
        console.log(`📤 Finished sending emails at ${new Date()}`);
    } catch (error) {
        console.error("🚨 Send email cron error:", error.message);
    }
}

let isRunning = false


export const handleExistingLeadsCron = async () => {
    if (isRunning) {
        console.log("⚠️ Skipping handleNewLeads cron — already running");
        return;
    }

    isRunning = true;
    try {
        await markFollowUp();
        await followUpEmail();
        await sendEmail();
    } catch (error) {
        console.error("🚨 Error in handleExistingLeadsCron:", error.message);
    } finally {
        isRunning = false;
    }
}

handleExistingLeadsCron()

cron.schedule("*/5 * * * *", handleExistingLeadsCron);