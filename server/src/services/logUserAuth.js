const fetch = require('node-fetch')
const { log, HELPERS } = require('./logger')

const capCamel = (str) =>
  str
    .replace(/([a-z](?=[A-Z]))/g, '$1 ')
    .split(' ')
    .map((str2) => str2.charAt(0).toUpperCase() + str2.slice(1))
    .join(' ')

const mapPerms = (perms, userPerms) =>
  perms
    .map(
      (perm) => `${capCamel(perm)}: ${userPerms[perm] ? '\u2705' : '\u274c'}`,
    )
    .join('\n')

module.exports = async function getAuthInfo(req, user, strategy = 'custom') {
  const ip =
    req.headers['cf-connecting-ip'] ||
    (req.headers['x-forwarded-for'] || '').split(', ')[0] ||
    (req.connection.remoteAddress || req.connection.localAddress).match(
      '[0-9]+.[0-9].+[0-9]+.[0-9]+$',
    )[0]

  const geo = await fetch(
    `http://ip-api.com/json/${ip}?fields=66846719&lang=en`,
  )
    .then((res) => res.json())
    .catch((err) => {
      log.warn(
        HELPERS.custom(strategy.toUpperCase(), '#7289da'),
        'failed to fetch user information',
        err,
      )
      return {}
    })

  const embed = {
    color: 0xff0000,
    title: 'Authentication',
    author: {
      name: user.username,
      icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    },
    description: `${user.username} ${
      user.valid ? 'Successfully' : 'Failed'
    } Authentication`,
    thumbnail: {
      url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    },
    fields: [
      {
        name: `${strategy} ID`,
        value: `<@${user.id}>`,
      },
      {
        name: 'Client Info',
        value: req.headers['user-agent'],
      },
      {
        name: 'Ip Address',
        value: `||${ip}||`,
      },
      {
        name: 'Geo Lookup',
        value: `${geo.city || ''}, ${geo.regionName || ''}, ${geo.zip || ''}`,
      },
      {
        name: 'Google Map',
        value: `https://www.google.com/maps?q=${geo.lat || 0},${geo.lon || 0}`,
      },
      {
        name: 'Network Provider',
        value: `${geo.isp || ''}, ${geo.as || ''}`,
      },
      {
        name: 'Mobile',
        value: `${Boolean(geo.mobile)}`,
        inline: true,
      },
      {
        name: 'Proxy',
        value: `${Boolean(geo.proxy)}`,
        inline: true,
      },
      {
        name: 'Hosting',
        value: `${Boolean(geo.hosting)}`,
        inline: true,
      },
      {
        name: 'Pokemon',
        value: mapPerms(['pokemon', 'iv', 'pvp'], user.perms),
        inline: true,
      },
      {
        name: 'Gyms',
        value: mapPerms(['gyms', 'raids', 'gymBadges'], user.perms),
        inline: true,
      },
      {
        name: 'Admin',
        value: mapPerms(['scanCells', 'spawnpoints', 'devices'], user.perms),
        inline: true,
      },
      {
        name: 'Wayfarer',
        value: mapPerms(['portals', 'submissionCells', 's2cells'], user.perms),
        inline: true,
      },
      {
        name: 'Pokestops',
        value: mapPerms(
          ['pokestops', 'eventStops', 'quests', 'lures', 'invasions'],
          user.perms,
        ),
        inline: true,
      },
      {
        name: 'Other',
        value: mapPerms(
          ['nests', 'weather', 'scanAreas', 'donor', 'backups'],
          user.perms,
        ),
        inline: true,
      },
    ],
    timestamp: new Date(),
  }
  if (user.perms.areaRestrictions.length) {
    const trimmed = user.perms.areaRestrictions
      .filter((_f, i) => i < 15)
      .map((f) => capCamel(f))
      .join('\n')
    embed.fields.push({
      name: `(${user.perms.areaRestrictions.length}) Area Restrictions`,
      value:
        user.perms.areaRestrictions.length > 15
          ? `${trimmed}\n...${user.perms.areaRestrictions.length - 15} more`
          : trimmed,
      inline: true,
    })
  }
  if (user.perms.webhooks.length) {
    embed.fields.push({
      name: 'Webhooks',
      value: user.perms.webhooks.map((str) => capCamel(str)).join('\n'),
      inline: true,
    })
  }
  if (user.perms.scanner.length) {
    embed.fields.push({
      name: 'Scanner',
      value: user.perms.scanner.map((str) => capCamel(str)).join('\n'),
      inline: true,
    })
  }
  if (user.valid) {
    log.info(
      HELPERS.custom(strategy.toUpperCase(), '#7289da'),
      user.username,
      `(${user.id})`,
      'Authenticated successfully.',
    )
    embed.color = 0x00ff00
  } else if (user.perms?.blocked) {
    log.warn(
      HELPERS.custom(strategy.toUpperCase(), '#7289da'),
      user.id,
      'Blocked due to',
      user.blocked,
    )
    embed.description = `User Blocked Due to ${user.blocked}`
    embed.color = 0xff0000
  } else {
    log.warn(
      HELPERS.custom(strategy.toUpperCase(), '#7289da'),
      user.id,
      'Not authorized to access map',
    )
  }
  return embed
}
