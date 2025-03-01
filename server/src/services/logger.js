const logger = require('loglevel')
const chalk = require('chalk')

const log = logger.getLogger('logger')

module.exports.log = log

const HELPERS = {
  trace: chalk.gray('☰'),
  debug: chalk.green('☯'),
  info: chalk.blue('ℹ'),
  warn: chalk.yellow('⚠'),
  error: chalk.red('✖'),
  telegram: chalk.hex('#26A8EA')('[TELEGRAM]'),
  discord: chalk.hex('#7289da')('[DISCORD]'),
  cache: chalk.blueBright('[CACHE]'),
  gql: chalk.hex('#3F20BA')('[GQL]'),
  express: chalk.hex('#FFA500')('[EXPRESS]'),
  locales: chalk.cyan('[LOCALES]'),
  masterfile: chalk.magenta('[MASTERFILE]'),
  i18n: chalk.cyanBright('[I18N]'),
  init: chalk.hex('#800080')('[INIT]'),
  session: chalk.hex('#FF69B4')('[SESSION]'),
  auth: chalk.hex('#ad3978')('[AUTH]'),
  api: chalk.hex('#fe7c73')('[API]'),
  client: chalk.hex('#90caf9')('[CLIENT]'),
  config: chalk.hex('#f48fb1')('[CONFIG]'),
  areas: chalk.hex('#9ccc65')('[AREAS]'),
  update: chalk.hex('#795548')('[UPDATE]'),
  db: chalk.hex('#aa00ff')('[DB]'),
  event: chalk.hex('#283593')('[EVENT]'),
  webhooks: chalk.hex('#1de9b6')('[WEBHOOKS]'),
  geocoder: chalk.hex('#ff5722')('[GEOCODER]'),
  fetch: chalk.hex('#880e4f')('[FETCH]'),
  scanner: chalk.hex('#b39ddb')('[SCANNER]'),
  build: chalk.hex('#ef6c00')('[BUILD]'),

  pokemon: chalk.hex('#f44336')('[POKEMON]'),
  pokestops: chalk.hex('#e91e63')('[POKESTOPS]'),
  gyms: chalk.hex('#9c27b0')('[GYMS]'),
  weather: chalk.hex('#3f51b5')('[WEATHER]'),
  available: chalk.hex('#2196f3')('[AVAILABLE]'),
  scanAreas: chalk.hex('#00bcd4')('[SCAN AREAS]'),
  scanAreasMenu: chalk.hex('#009688')('[SCAN AREAS MENU]'),
  submissionCells: chalk.hex('#4caf50')('[SUBMISSION CELLS]'),
  spawnpoints: chalk.hex('#8bc34a')('[SPAWNPOINTS]'),
  scanCells: chalk.hex('#ffeb3b')('[SCAN CELLS]'),
  s2cells: chalk.hex('#ffc107')('[S2 CELLS]'),
  devices: chalk.hex('#ff9800')('[DEVICE]'),

  custom: (text, color = '#64b5f6') => chalk.hex(color)(`[${text}]`),
}

module.exports.HELPERS = HELPERS

log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = logger.methodFactory(methodName, logLevel, loggerName)
  return (...args) => {
    rawMethod(HELPERS[methodName] ?? '', ...args)
  }
}

log.setLevel(process.env.LOG_LEVEL || 'info')
