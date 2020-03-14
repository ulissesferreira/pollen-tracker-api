import cheerio from 'cheerio'
import fetch from 'node-fetch'

const LEVELS_LIST = [
  'Muito elevados',
  'Elevados',
  'Moderados',
  'Baixos'
]

const POLLENS_LIST = [
  'Artemisia',
  'Azeda',
  'Azinheira',
  'Bétula',
  'Carvalhos',
  'Castanheiro',
  'Cedro',
  'Cipreste',
  'Erva-de-orelha',
  'Eucalipto',
  'Funcho',
  'Gramíneas',
  'Oliveira',
  'Palmeira',
  'Parietária',
  'Pinheiro',
  'Plátano',
  'Quenopódio',
  'Salgueiro',
  'Tanchagem',
  'Urtiga'
]

export interface PollenData {
  level: string,
  pollens: string[]
}

export interface PollenParser {
  data: PollenData,
  lastUpdated: string
}

export class PollenParser {

  constructor() {
    const startTime = new Date()
    const lastUpdated = `${startTime.getFullYear()}${startTime.getMonth()}${startTime.getDate()}`

    this.data = null
    this.lastUpdated = lastUpdated

    // Initialize server and populate cache
    this.fetchNewData()
  }

  async getPollenData() {
    // We have cache and it is fresh
    if (this.data && this.isSameDay(this.lastUpdated)) {
      return this.data
    }

    // No cache, we update it and send the result
    return await this.fetchNewData()
  }

  async fetchNewData(): Promise<PollenData> {
    const response = await fetch('https://www.rpaerobiologia.com/previsao-polinica/lisboa')
    const rawHTML: string = await response.text()
    const newData = this.parseHTML(rawHTML)
    this.data = newData
    return newData
  }

  /*
  ** Parses incoming HTML from https://www.rpaerobiologia.com/previsao-polinica/lisboa
  ** And returns structured data
  */
  parseHTML(inputHTML: string): PollenData {
    const $: CheerioStatic = cheerio.load(inputHTML, { decodeEntities: false })
    const rawString: string = $('.previsao-text').text()
    const level = this.getLevelFromData(LEVELS_LIST, rawString)
    const pollens = this.getPollensFromData(POLLENS_LIST, rawString)

    return {
      level,
      pollens
    }
  }

  /*
  ** Returns a string with the level of pollen on the atmosphere
  */
  getLevelFromData(levelsList: string[], data: string): string {

    let currentLevel: string = levelsList.find((level) => {
      return data.includes(level.toLowerCase())
    })

    return currentLevel
  }

  /*
  ** Returns an array of strings with the names of the pollens found.
  ** If no pollen is found returns an empty array.
  */
  getPollensFromData(pollensList: string[], data: string): string[] {

    let presentPollens: string[] = pollensList.filter((pollen) => {
      return data.includes(pollen.toLowerCase())
    })
  
    return presentPollens
  }

  /*
  ** Returns true if it's the same day as input parameter
  ** false otherwise.
  */
  isSameDay(oldTime: string) {
    const now = new Date()
    const nowId = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`
    return nowId === oldTime
  }
}
