const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERR:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.waitForSelector('button[aria-label="AI 비서"]');
  console.log('Clicking FAB...');
  await page.click('button[aria-label="AI 비서"]');
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Typing in input...');
  await page.type('input[placeholder="어떤 AI가 필요하신가요?"]', '테스트 전송');
  
  const val = await page.$eval('input[placeholder="어떤 AI가 필요하신가요?"]', el => el.value);
  console.log('Input value is:', val);
  
  await browser.close();
})();
