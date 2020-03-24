const cheerio = require('cheerio')
const request = require('request')
const table = require('cli-table')

let results = new table({
  head: ['Marka', 'Model', 'Moc (KM)', 'Cena', 'Cena za 1 KM']
})

const options = {
  url: `https://www.wyborkierowcow.pl/moc-w-przeliczeniu-na-zlotowki-zestawienie/?fbclid=IwAR1F_s2FNitXJZyBqXU--qswGiHmYKvPO7rLpdx_rotAgiFA2etuGiW_mdo`
}

request(options, (error, response, html) => {
    if(!error && response.statusCode == 200) {
      const $ = cheerio.load(html)

      $('tbody tr').each((i, element) => {
        const marka = $(element).find('.column-2').text();
        const model = $(element).find('.column-3').text();
        const cena = $(element).find('.column-7').text();
        const moc = $(element).find('.column-5').text();
        const cenazakm = cena / moc;
        results.push([marka, model, moc, cena, Math.round(cenazakm)]);
      })
      printTable();
    }
});


function printTable() {
  results.sort(compare)
  console.log(results.toString())
}

function compare(a, b) {
  if(a[4] == b[4]) return 0;
  else return (a[4] < b[4]) ? -1 : 1;
}