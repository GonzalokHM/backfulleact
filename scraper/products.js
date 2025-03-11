import puppeteer from 'puppeteer'

async function productScraper(name) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  const searchUrl = `https://www.mejoresresenas.es/${name}`

  console.log(`Scrapeando: ${searchUrl}`)
  await page.goto(searchUrl, { waitUntil: 'networkidle2' })

  await page.waitForSelector('li.product', { timeout: 10000 }).catch(() => {
    console.error('No se encontró el selector esperado')
  })

  const resultados = await page.evaluate(() => {
    const items = []

    const categoria =
      document
        .querySelector('ul.mt-16 li:nth-of-type(2) a')
        ?.innerText.trim() || 'sin categoria'

    document.querySelectorAll('li.product').forEach((elem) => {
      const titulo =
        elem.querySelector('h2.productTitle')?.innerText.trim() || 'Sin título'
      const img =
        elem.querySelector('img.desktop-main-image')?.src || 'Sin imagen'
      const highlightElements = elem.querySelectorAll(
        'ul.list-disc li.productHighlights'
      )
      const descripcion =
        Array.from(highlightElements)
          .map((el) => el.innerText.trim())
          .join(', ') || 'Sin descripcion'
      const puntuacion =
        elem.querySelector('span.productScore')?.innerText.trim() ||
        'Sin puntuación'

      const priceElements = elem.querySelectorAll('span.f18b')
      const precioStr =
        priceElements.length > 1 ? priceElements[1].innerText.trim() : '0'
      const precioNormalizado = precioStr.replace(/\./g, '').replace(',', '.')
      const precio = parseFloat(precioNormalizado) || 0

      const marca =
        elem.querySelector('span.f16r')?.innerText.trim() || 'sin marca'

      let asin = 'sin asin'
      const link = elem.querySelector('a.productLink[href*="/dp/"]')
      if (link) {
        const href = link.href
        const asinMatch = href.match(/\/dp\/([^/?]+)/)
        if (asinMatch) {
          asin = asinMatch[1]
          console.log('ASIN:', asin)
        }
      }

      items.push({
        categoria,
        asin,
        titulo,
        img,
        descripcion,
        puntuacion,
        precio,
        marca
      })
    })
    return items
  })

  await browser.close()

  return resultados
}

export default productScraper
