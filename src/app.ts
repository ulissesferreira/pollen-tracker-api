import { PollenParser, PollenData } from './utils/pollenParser'
const pollenParser: any = new PollenParser()

require('dotenv').config()

const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-cors'), {
  origin: '*'
})

fastify.get('/', async (request: any, reply: any) => {
  const data: PollenData = pollenParser.getPollenData();
  return data
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()