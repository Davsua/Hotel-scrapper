import puppeteer, { launch } from 'puppeteer';
import fs from 'fs/promises';
import { OpenEachLink } from './hotel.js';

// -----------------------------
//    basics
// -----------------------------

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 300,
    //devtools: true,
    //userDataDir: './cache/like',
    //headless: 'new',
    //args: ['--headless=new'],
    defaultViewport: { width: 1280, height: 1024 },
    timeout: 60000,
  });
  const page = await browser.newPage();

  const dateIn = '2024-01-24'; //formato AAAA/MM/DD
  const dateOut = '2024-01-25'; //formato AAAA/MM/DD
  const place = 'El+Poblado';
  const distance = 3000;
  const mainPage = `https://www.booking.com/searchresults.en-us.html?checkin=${dateIn}&checkout=${dateOut}&selected_currency=USD&ss=${place}&ssne=${place}&ssne_untouched=${place}&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=1&no_rooms=1&group_children=0&sb_travel_purpose=leisure%27&nflt=distance%3D${distance}`;

  //! https://www.booking.com/searchresults.en-us.html?checkin=2023-12-24&checkout=$2023-12-25&selected_currency=USD&ss=elpoblado&ssne=elpoblado&ssne_untouched=elpoblado&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=1&no_rooms=1&group_children=0&sb_travel_purpose=leisure%27&nflt=distance%3D$3000

  // Maneja el evento 'request'
  /*page.on('request', (request) => {
    // Cancela la redirección
    if (request.isNavigationRequest() && request.redirectChain().length > 0) {
      console.log(request.url());
      //request.abort();
    } else {
      request.continue();
    }
  });*/

  await page.goto(
    `https://www.booking.com/searchresults.html?ss=${place}&ssne=${place}&ssne_untouched=${place}&label=gen173nr-1FCAMoMkIIbWVkZWxsaW5IM1gEaDKIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4ArXokKoGwAIB0gIkYzg0ZTlkNDItNDFmNC00M2IxLTkxMDQtNzViN2I0ZmMwZDgx2AIF4AIB&sid=52feeb8ab898d8596b879bcfea0d1bcb&aid=304142&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=4137&dest_type=district&checkin=${dateIn}&checkout=${dateOut}&group_adults=1&no_rooms=1&group_children=0&nflt=distance%3D${distance}&selected_currency=USD`
  );

  const loc = await page.url();
  console.log(loc);

  const hotelCard = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="property-card"]');
    let hotelsArray = [];
    cards.forEach((card) => {
      let url = card.querySelector('a').href.trim();
      let title = card.querySelector('h3')?.textContent.trim();
      let starsCount = card.querySelectorAll('[data-testid="rating-stars"] > span');
      let stars = starsCount.length;
      let rating = card.querySelector('[aria-label*="Scored"]')?.textContent.trim();

      let benefitsArr = [];
      card.querySelectorAll('.ba51609c35 > li').forEach((ben) => {
        benefitsArr.push(ben.textContent.trim());
      });
      let benefits = benefitsArr.length > 0 ? benefitsArr : null;

      hotelsArray.push({
        url,
        title,
        rating,
        stars,
        benefits,
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
