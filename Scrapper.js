const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });

    const website_url = 'https://www.jobstreet.com.ph/en/job-search/job-vacancy.php?key=software+engineer';

    // Navigate to JobStreet search results page
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    // Wait for job listings to load
    await page.waitForSelector('.z1s6m00', { timeout: 10000 });

    // Extract job data
    const jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.z1s6m00')).map(job => {
            const titleElement = job.querySelector('.FYwKg');
            const companyElement = job.querySelector('.x1wZxd');
            const locationElement = job.querySelector('.z1XrwK');

            return {
                title: titleElement ? titleElement.innerText : null,
                company: companyElement ? companyElement.innerText : null,
                location: locationElement ? locationElement.innerText : null,
            };
        });
    });

    console.log(jobs);

    await browser.close();
})();
