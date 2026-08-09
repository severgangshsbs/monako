export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, date, time, guests } = req.body;

    const message = `
☕ НОВАЯ БРОНЬ — МОНА&КО

👤 Имя: ${name || "Не указано"}
📞 Телефон: ${phone || "Не указан"}
📅 Дата: ${date || "Не указана"}
🕐 Время: ${time || "Не указано"}
👥 Гостей: ${guests || "Не указано"}
    `;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram error:", error);
      return res.status(500).json({ error: "Не удалось отправить сообщение в Telegram" });
    }

    return res.status(200).json({
      success: true,
      message: "Бронь успешно отправлена",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Ошибка сервера",
    });
  }
}
