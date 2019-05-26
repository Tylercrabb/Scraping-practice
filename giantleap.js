const puppeteer = require("puppeteer");
const chalk = require("chalk")

const error = chalk.bold.red;
const success = chalk.keyword("green");

try {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto("https://news.ycombinator.com/");
  await page.waitForSelector("a.storylink");

  const news = await page.evaluate(() => {
    const titleNodeList = document.querySelectorAll('a.storylink');
    const ageList = document.querySelectorAll('span.age')
    const scoreList = document.querySelectorAll('span.score');
    const titleLinkArray = [];
    for (let i = 0; i < titleNodeList.length; i++) {
      titleLinkArray[i] = {
        title: titleNodeList[i].innerText.trim(),
        link: titleNodeList[i].getAttribute("href"),
        age: ageList[i].innerText.trim(),
        score: scoreList[i].innerText.trim()
      };
    }
    return titleLinkArray;
  });

  await browser.close();

  fs.writeFile("hackernews.json", JSON.stringify(news), function (err) {
    if (err) throw err;
    console.log("Saved!")
  });
  console.log(success("Browser Closed"));
} catch (err) {
  console.log(error(err));
  await browser.close();
  console.log(error("Browser Closed"))
}