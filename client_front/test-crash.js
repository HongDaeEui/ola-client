const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERR:', error.message));
  
  await page.goto('https://www.olalab.kr/categories', { waitUntil: 'networkidle2' });
  await page.waitForSelector('button[aria-label="AI 비서"]');
  console.log('Clicking FAB...');
  await page.click('button[aria-label="AI 비서"]');
  await new Promise(r => setTimeout(r, 2000));
  console.log('Done.');
  await browser.close();
})();
