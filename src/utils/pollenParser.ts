import cheerio from 'cheerio'

const POLLENS_LIST = [
  'Artemisia',
  'Azeda',
  'Azinheira',
  'Bétula',
  'Carvalhos',
  'Castanheiro',
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

export class PollenParser {

  /*
  ** Parses incoming HTML from https://www.rpaerobiologia.com/previsao-polinica/lisboa
  ** And returns structured data
  */
  parseHTML(inputHTML: string): PollenData {
    const $: CheerioStatic = cheerio.load(inputHTML, { decodeEntities: false })
    const rawLevel: string = $('.previsao-text')
      .text()
      .trim()
      .split('os pólenes encontram-se em níveis ')[1]
      .split(',')[0]
    const level = rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1);
    const pollensString: string = $('.previsao-text')
      .text()
      .trim()
      .split('com predomínio dos pólenes')[1]
      .split('.')[0]
  
    const pollens = this.getPollensFromData(POLLENS_LIST, pollensString)
  
    return {
      level,
      pollens
    }
  }

  /*
  ** Returns true if the data string parameter has the pollen
  ** name in it.
  */
  getPollensFromData(pollensList: string[], data: string): string[] {

    let presentPollens: string[] = pollensList.filter((pollen) => {
      return data.includes(pollen.toLowerCase())
    })
  
    return presentPollens
  }
}
