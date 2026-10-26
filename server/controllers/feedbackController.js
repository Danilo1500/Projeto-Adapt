import sendEmail from "../configs/nodeMailer.js";
import Feedback from "../models/Feedback.js";

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

export const createSendFeedback = ({ FeedbackModel, sendEmail: deliverEmail, logger = console }) => async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ success: false, message: "Escreva uma mensagem antes de enviar." });
  }

  if (message.length > 5000) {
    return res.status(400).json({ success: false, message: "A mensagem deve ter no máximo 5.000 caracteres." });
  }

  const senderName = req.dbUser.full_name || req.dbUser.username || "Usuário Adapt";
  const senderEmail = req.dbUser.email || "";

  try {
    const feedback = await FeedbackModel.create({
      user: req.dbUser._id,
      senderName,
      senderEmail,
      message,
    });

    try {
      const safeName = escapeHtml(senderName);
      const safeEmail = escapeHtml(senderEmail || "Não informado");
      const safeMessage = escapeHtml(message);

      await deliverEmail({
        to: "resendedanielcouto@gmail.com",
        subject: "Feedback do aplicativo Adapt",
        body: `<p>Feedback enviado por ${safeName} (${safeEmail}):</p><pre>${safeMessage}</pre>`,
        text: `Feedback enviado por ${senderName} (${senderEmail || "Não informado"}):\n\n${message}`,
      });

      return res.status(200).json({ success: true, notificationSent: true, message: "Feedback enviado com sucesso." });
    } catch (error) {
      logger.error("Feedback email delivery failed:", error.message);
      return res.status(200).json({
        success: true,
        notificationSent: false,
        message: "Feedback registrado, mas a notificação por e-mail não foi enviada.",
      });
    }
  } catch (error) {
    logger.error("Feedback persistence failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Não foi possível registrar o feedback agora. Tente novamente mais tarde.",
    });
  }
};

export const sendFeedback = createSendFeedback({ FeedbackModel: Feedback, sendEmail });
