const fs = require('fs');
let s = fs.readFileSync('src/app/[locale]/layout.tsx', 'utf8');
s = s.replace(/import getRequestConfig from '@\/i18n\/request';/g, "import { NextIntlClientProvider } from 'next-intl';\nimport { getMessages } from 'next-intl/server';");
s = s.replace(/const \{ locale \} = await params;/g, "const { locale } = await params;\n  const messages = await getMessages();");
s = s.replace(/<ThemeProvider>/g, "<NextIntlClientProvider messages={messages}>\n        <ThemeProvider>");
s = s.replace(/<\/ThemeProvider>/g, "</ThemeProvider>\n        </NextIntlClientProvider>");
fs.writeFileSync('src/app/[locale]/layout.tsx', s);
