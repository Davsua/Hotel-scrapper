import puppeteer, { launch } from 'puppeteer';
import fs from 'fs/promises';
import { OpenEachLink } from './hotel.js';

// -----------------------------
//    basics
// -----------------------------

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 30,
    devtools: true,
    //userDataDir: './cache/like',
    //headless: 'new',
    //args: ['--headless=new'],
  });
  const page = await browser.newPage();

  const dateIn = '2023-12-24'; //formato AAAA/MM/DD
  const dateOut = '2023-12-25'; //formato AAAA/MM/DD
  const place = 'elpoblado';
  const distance = 3000;

  //! https://www.booking.com/searchresults.en-us.html?checkin=2023-12-24&checkout=$2023-12-25&selected_currency=USD&ss=elpoblado&ssne=elpoblado&ssne_untouched=elpoblado&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=1&no_rooms=1&group_children=0&sb_travel_purpose=leisure%27&nflt=distance%3D$3000

  await page.goto(
    `https://www.booking.com/searchresults.en-us.html?checkin=${dateIn}&checkout=${dateOut}&selected_currency=USD&ss=${place}&ssne=${place}&ssne_untouched=${place}&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=1&no_rooms=1&group_children=0&sb_travel_purpose=leisure%27&nflt=distance%3D${distance}`
  );

  const hotelCard = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="property-card"]');
    let hotelsArray = [];
    cards.forEach((card) => {
      let url = card.querySelector('a').href.trim();
      let title = card.querySelector('h3')?.textContent.trim();
      let starsCount = card.querySelectorAll('[data-testid="rating-stars"] > span');
      let stars = starsCount.length;
      let rating = card.querySelector('[aria-label*="Scored"]').textContent.trim();
      hotelsArray.push({
        url,
        title,
        rating,
        stars,
      });
    });
    return hotelsArray;
  });

  try {
    await OpenEachLink(hotelCard, page);
  } catch (error) {
    //throw new Error('No funciono');
    console.log(error);
  }

  await browser.close();
  return hotelCard;
})();

//export default openWebPage;
