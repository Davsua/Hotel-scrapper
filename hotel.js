//import openWebPage from './index.js';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

export async function OpenEachLink(hotels, page) {
  /*const browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
    devtools: true,
    //userDataDir: './cache/like',
    //headless: 'new',
    //args: ['--headless=new'],
  });*/
  let result = [];

  try {
    for (const hotel of hotels) {
      const { url, title, rating, stars } = hotel;
      //const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // Realiza acciones adicionales en la página si es necesario

      const getHotelInfo = await page.evaluate(
        (title, rating) => {
          /*let title = document.querySelector('h2').textContent.trim();
        let rating = document
          .querySelector('[data-testid="review-score-right-component"] > [aria-label*="Scored"]')
          ?.textContent.trim();*/

          const ROOMS_NUMBER = document.querySelectorAll(
            '[data-et-mouseenter="goal:hp_rt_hovering_room_name"]'
          );

          let rooms = [];

          ROOMS_NUMBER.forEach((roomElement) => {
            let room = {
              name: roomElement.textContent.trim(),
              // Puedes agregar más propiedades según lo necesario
            };
            rooms.push(room);
          });

          return { rooms, title, rating, stars };
        },
        title,
        rating
      );
      console.log(getHotelInfo.rooms);
      result.push(getHotelInfo);

      //await page.close();
    }
  } finally {
    // Cierra el navegador al finalizar
    //await browser.close();

    console.log(result);
  }
}

/*async function main() {
  const links = await openWebPage();
  await OpenEachLink(links);
}

main();*/

//!EJEMPLOOO
/*const puppeteer = require('puppeteer');

async function abrirPaginas(links) {
  const browser = await puppeteer.launch();

  try {
    const pagePromises = links.map(async (link) => {
      const page = await browser.newPage();
      await page.goto(link);

      // Realiza acciones adicionales en la página si es necesario

      // Cierra la página después de realizar las acciones necesarias
      await page.close();
    });

    await Promise.all(pagePromises);
  } finally {
    // Cierra el navegador al finalizar
    await browser.close();
  }
}

// Ejemplo de uso
async function main() {
  const links = await openWebPage(); // Supongamos que openWebPage() devuelve un array de enlaces
  await abrirPaginas(links);
}

main();*/
