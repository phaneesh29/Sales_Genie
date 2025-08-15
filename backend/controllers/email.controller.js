import { EmailModel } from "../models/email.model.js";
import { LeadModel } from "../models/leads.model.js";
import { mailer } from "../utils/email.service.js";

export const sendCustomEmailController = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, body } = req.body;

        if (!id || !subject || !body) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const lead = await LeadModel.findById(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        await mailer({ to: lead.email, subject, text: body });

        const email = await EmailModel.findOne({ leadId: id, leadEmail: lead.email });

        if (!email) {
            await EmailModel.create({
                leadId: lead._id,
                leadEmail: lead.email,
                subject,
                body,
                status: "sent",
                nextMailDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            });
        } else {
            email.status = "sent";
            email.nextMailDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
            await email.save();
        }

        lead.status = "contacted";
        await lead.save();
        return res.status(200).json({ message: "Email sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}