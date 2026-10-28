# Univers Hunters — сайт

Статичный сайт + функция `api/lead.js`, которая отправляет заявки с формы в Telegram.

## Публикация на Vercel
1. Залейте папку в новый репозиторий GitHub (можно перетащить файлы в браузере).
2. vercel.com → Add New → Project → Import этот репозиторий → Deploy. Настройки сборки не нужны.
3. Settings → Environment Variables:
   - `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
   - `TELEGRAM_CHAT_ID` — ваш chat id
   Затем Deployments → Redeploy.

## Пиксель Meta
В `index.html` найдите `var FB_PIXEL_ID = '';` и впишите ID пикселя (только цифры).
События: PageView, Lead (отправка формы), Contact (клик WhatsApp/звонок).
