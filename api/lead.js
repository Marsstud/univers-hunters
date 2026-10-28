// Vercel Serverless Function: принимает заявку с сайта и отправляет её в Telegram.
// Нужны переменные окружения в Vercel (Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_ID   — ваш chat id (куда бот присылает заявки)

function clean(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  // Скрытое поле-ловушка для ботов: люди его не заполняют.
  if (clean(body.company, 100)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  if (!name || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, error: 'name_phone_required' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const digits = phone.replace(/\D/g, '');
  const lines = [
    'Новая заявка с сайта Univers Hunters',
    '',
    'Имя: ' + name,
    'Телефон: ' + phone,
    'WhatsApp: https://wa.me/' + digits,
    'Instagram/сайт: ' + (clean(body.link, 120) || '—'),
    'Что есть: ' + (clean(body.has, 60) || '—'),
    'Пакет: ' + (clean(body.pack, 60) || '—'),
    'Страница: ' + (clean(body.page, 200) || '—'),
  ];

  try {
    const tg = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), disable_web_page_preview: true }),
    });
    if (!tg.ok) {
      console.error('Telegram error', tg.status, await tg.text());
      return res.status(502).json({ ok: false });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Telegram request failed', e);
    return res.status(502).json({ ok: false });
  }
};
