const fs = require('fs')
const path = require('path')
const { api } = require('../src/services/config')
const { log, HELPERS } = require('../src/services/logger')
const fetchJson = require('../src/services/api/fetchJson')

const appLocalesFolder = path.resolve(__dirname, '../../public/base-locales')
const finalLocalesFolder = path.resolve(__dirname, '../../public/locales')
const missingFolder = path.resolve(__dirname, '../../public/missing-locales')

const locales = async () => {
  if (!api.pogoApiEndpoints.translations)
    log.error(HELPERS.locales, 'No translations endpoint')
  const localTranslations = await fs.promises.readdir(appLocalesFolder)
  const englishRef = fs.readFileSync(
    path.resolve(appLocalesFolder, 'en.json'),
    { encoding: 'utf8', flag: 'r' },
  )

  fs.mkdir(finalLocalesFolder, (error) =>
    error
      ? log.info(HELPERS.locales, 'Locales folder already exists, skipping')
      : log.info(HELPERS.locales, '[LOCALES] locales folder created'),
  )

  const availableRemote = await fetchJson(
    `${api.pogoApiEndpoints.translations}/index.json`,
  )

  await Promise.all(
    localTranslations.map(async (locale) => {
      const reactMapTranslations = fs.readFileSync(
        path.resolve(appLocalesFolder, locale),
        { encoding: 'utf8', flag: 'r' },
      )
      const baseName = locale.replace('.json', '')
      const trimmedRemoteFiles = {}

      fs.mkdir(`${finalLocalesFolder}/${baseName}`, (error) =>
        error ? {} : log.info(HELPERS.locales, locale, `folder created`),
      )

      try {
        const hasRemote = availableRemote.includes(locale)
        const remoteFiles = await fetchJson(
          `${api.pogoApiEndpoints.translations}/static/locales/${
            hasRemote ? baseName : 'en'
          }.json`,
        )

        if (!hasRemote) {
          log.warn(
            HELPERS.locales,
            'No remote translation found for',
            locale,
            'using English',
          )
        }

        Object.keys(remoteFiles).forEach((key) => {
          if (
            !key.startsWith('desc_') &&
            !key.startsWith('pokemon_category_')
          ) {
            if (key.startsWith('quest_') || key.startsWith('challenge_')) {
              trimmedRemoteFiles[key] = remoteFiles[key]
                .replace(/%\{/g, '{{')
                .replace(/\}/g, '}}')
            } else {
              trimmedRemoteFiles[key] = remoteFiles[key]
            }
          }
        })
      } catch (e) {
        log.error(HELPERS.locales, e, '\n', locale)
      }

      const finalTranslations = {
        ...JSON.parse(englishRef),
        ...trimmedRemoteFiles,
        ...JSON.parse(reactMapTranslations),
      }
      fs.writeFile(
        path.resolve(finalLocalesFolder, baseName, 'translation.json'),
        JSON.stringify(finalTranslations, null, 2),
        'utf8',
        () => {},
      )
      log.info(HELPERS.locales, locale, 'file saved.')
    }),
  )
}

const missing = async () => {
  const localTranslations = await fs.promises.readdir(appLocalesFolder)
  const englishRef = JSON.parse(
    fs.readFileSync(path.resolve(appLocalesFolder, 'en.json'), {
      encoding: 'utf8',
      flag: 'r',
    }),
  )

  fs.mkdir(missingFolder, (error) =>
    error ? {} : log.info(HELPERS.locales, 'Locales folder created'),
  )

  localTranslations.forEach((locale) => {
    const reactMapTranslations = JSON.parse(
      fs.readFileSync(path.resolve(appLocalesFolder, locale), {
        encoding: 'utf8',
        flag: 'r',
      }),
    )
    const missingKeys = {}

    Object.keys(englishRef).forEach((key) => {
      if (!reactMapTranslations[key]) {
        missingKeys[key] = process.argv.includes('--ally')
          ? `t('${key}')`
          : englishRef[key]
      }
    })
    fs.writeFile(
      path.resolve(
        missingFolder,
        process.argv.includes('--ally')
          ? locale.replace('.json', '.js')
          : locale,
      ),
      JSON.stringify(missingKeys, null, 2),
      'utf8',
      () => {},
    )
    log.info(HELPERS.locales, locale, 'file saved.')
  })
}

module.exports.locales = locales
module.exports.missing = missing

if (require.main === module) {
  locales().then(() => log.info(HELPERS.locales, 'Translations generated'))

  if (process.argv[2] === '--missing') {
    missing().then(() =>
      log.info(HELPERS.locales, 'Missing translations generated'),
    )
  }
}
