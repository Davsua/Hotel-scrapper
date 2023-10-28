import puppeteer, { launch } from 'puppeteer';
import fs from 'fs/promises';

// -----------------------------
//    basics
// -----------------------------

async function openWebPage() {
  const browser = await puppeteer.launch({
    headless: false, //ver lo que esta sucediendo
    slowMo: 200, // tiempo de cada paso
  });
  const page = await browser.newPage();

  await page.goto(
    'https://www.booking.com/searchresults.en-us.html?checkin=2023-12-23&checkout=2023-12-24&selected_currency=USD&ss=elpoblado&ssne=elpoblado&ssne_untouched=elpoblado&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=1&no_rooms=1&group_children=0&sb_travel_purpose=leisure%27&nflt=distance%3D3000'
  );

  //evaluate -> permite ejecutar scripts de manejo de DOM ; funcion totalmente aparte, solo conoce los valores que esten dentro de ella
  const result = await page.evaluate(() => {
    let hotels = [];
    const cards = document.querySelectorAll('[data-testid="property-card"]');
    cards.forEach((data) => {
      let hotel = {};
      hotel.name = data.querySelector('h3').textContent.trim();
      hotel.location = data.querySelector('[data-testid="address"]').textContent.trim();
      let benefits = [];
      data.querySelectorAll('[data-testid="recommended-units"] > div > div > span').forEach((ben) => {
        benefits.push(ben.textContent.trim());
      });
      hotel.benefits = benefits.length > 0 ? benefits : null;
      hotel.price = data.querySelector('[data-testid="price-and-discounted-price"]').textContent.trim();
      hotel.taxes = data
        .querySelector('[data-testid="taxes-and-charges"]')
        .textContent.replace(/\+|taxes and charges/g, '')
        .trim();
      let price = Number(hotel.price.split('$').pop());
      let taxes = Number(hotel.taxes.split('$').pop());
      hotel.totalPrice = '$' + (price + taxes) + ' USD';
      stars = data.querySelectorAll('[data-testid="rating-stars"] > span');
      hotel.rating = stars.length;
      hotels.push(hotel);
    });
    return hotels;
  });

  //console.log(result);

  await fs.writeFile('data-hotels.js', JSON.stringify(result, null, 2));
  // --> await page.screenshot({ path: 'example.png' }); ------ captura de pantalla --------

  //await page.type('[data-testid="destination-container"] > div > div > div > input', 'elpoblado'); ---- escribir en un input ----
  //await page.click('button[type="submit"]');
  //await new Promise((r) => setTimeout(r, 5000));

  await browser.close();
}

openWebPage();
