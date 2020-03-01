import fetch from 'node-fetch'
import { PollenParser, PollenData } from './utils/pollenParser'

const pollenParser: any = new PollenParser()

const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request: any, reply: any) => {
  const response = await fetch('https://www.rpaerobiologia.com/previsao-polinica/lisboa')
  const rawHTML: string = await response.text()

  const data: PollenData = pollenParser.parseHTML(rawHTML)
  return data
})

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()