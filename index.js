require('dotenv').config();
const puppeteer = require('puppeteer-core');
const auth = process.env.AUTH_KEY;

async function run() {
    let browser;

    try {

        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        await page.goto(process.env.URL);

        const html = await page.evaluate(() => document.documentElement.outerHTML);
        console.log(html);

        // testing with URL specified in .env
        const selector = '#app-wrapper > div > div > div:nth-child(3) > div'

        await page.waitForSelector(selector);
        const element = await page.$(selector);

        // const text = await page.evaluate(element => element.textContent, element);
        // console.log(text);

        const text = await page.evaluate(element => element.innerHTML, element);
        console.log(text);

    } catch (error) {
        if (error.code === 'ECONNRESET') {
            console.error('Connection error: The WebSocket connection was closed unexpectedly.');
        } else {
            console.error(error);
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

run();