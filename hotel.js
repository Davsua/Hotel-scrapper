//import openWebPage from './index.js';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';

export async function OpenEachLink(hotels, page) {
  let result = [];

  try {
    for (const hotel of hotels) {
      const { url } = hotel;
      //const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      //const loc = await page.url();
      //console.log(loc);

      const getHotelInfo = await page.evaluate((hotel) => {
        const ROOMS_NUMBER = document.querySelectorAll(
          '[data-et-mouseenter="goal:hp_rt_hovering_room_name"]'
        );

        /*const ROOMS_BOX =
          ROOMS_NUMBER.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
            '.e2e-hprt-table-row'
          );*/

        console.log(ROOMS_NUMBER.length);

        let rooms = [];

        ROOMS_NUMBER.forEach((roomElement) => {
          //console.log('PASO');
          let filter =
            roomElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
              '.e2e-hprt-table-row'
            );
          //console.log('PASO');

          filter.forEach((roomBox) => {
            let room = {};
            //console.log(algo.previousElementSibling?.querySelector('[data-et-mouseenter="goal:hp_rt_hovering_room_name"]') ? true : false)

            /*if (
              roomBox.previousElementSibling?.querySelector(
                '[data-et-mouseenter="goal:hp_rt_hovering_room_name"]'
              )
            ) {
              //console.log('paso')

              /*name: roomBox.previousElementSibling
                  .querySelector('[data-et-mouseenter="goal:hp_rt_hovering_room_name"]')
                  .textContent.trim(),*/

            /*} else {
              /*name: roomBox.previousElementSibling.querySelector('td > div > div').textContent.trim(),*/

            /*}*/
            let ppnight = roomBox.querySelector('.hprt-table-cell-price');
            room.price = ppnight.querySelector('div.bui-price-display__value').textContent.trim();
            room.taxes = roomBox.querySelector('.prd-taxes-and-fees-under-price').textContent.trim();
            room.ocupancy = roomBox.querySelector('.hprt-table-cell-occupancy').textContent.trim();
            room.discount = roomBox
              .querySelector('[data-component="deals-container"]')
              ?.textContent.split('off')
              .shift()
              .trim();

            rooms.push(room);
          });
        });

        //const { url, ...restHotel } = hotel;
        //! FILTRAR OBJ REPETIDOS+
        const uniqueRooms = rooms.filter(function (i, pos) {
          return rooms.indexOf(i) === pos;
        });

        return { hotel, uniqueRooms };
      }, hotel);
      console.log(getHotelInfo.uniqueRooms.length);
      result.push(getHotelInfo);

      //await page.close();
    }
  } finally {
    // Cierra el navegador al finalizar
    //await browser.close();

    console.log(result);

    const jsonResult = JSON.stringify(result, null, 2);
    await fs.writeFile('resultado.json', jsonResult);
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
