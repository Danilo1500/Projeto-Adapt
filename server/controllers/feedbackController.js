import sendEmail from "../configs/nodeMailer.js";

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

export const sendFeedback = async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ success: false, message: "Escreva uma mensagem antes de enviar." });
  }

  if (message.length > 5000) {
    return res.status(400).json({ success: false, message: "A mensagem deve ter no máximo 5.000 caracteres." });
  }

  try {
    const senderName = req.dbUser.full_name || req.dbUser.username || "Usuário Adapt";
    const senderEmail = req.dbUser.email || "Não informado";
    const safeName = escapeHtml(senderName);
    const safeEmail = escapeHtml(senderEmail);
    const safeMessage = escapeHtml(message);

    await sendEmail({
      to: "resendedanielcouto@gmail.com",
      subject: "Feedback do aplicativo Adapt",
      body: `<p>Feedback enviado por ${safeName} (${safeEmail}):</p><pre>${safeMessage}</pre>`,
      text: `Feedback enviado por ${senderName} (${senderEmail}):\n\n${message}`,
    });

    return res.status(200).json({ success: true, message: "Feedback enviado com sucesso." });
  } catch (error) {
    console.error("Feedback email delivery failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "Não foi possível enviar o feedback agora. Tente novamente mais tarde.",
    });
  }
};
