// bwbaseInfo <https://github.com/msikma/hydrabot>
// © MIT license

import {gameTypeDefinitions} from 'sctoolsdata'
import {sortRaces} from 'sctoolsdata/lib/races/index.js'
import {formatChatToCodeBlock} from './chat.js'
import {formatDynamicTimestamp, formatFilesize, formatDateClockEmoji} from '../util/format.js'

/**
 * Returns a race emoji for a given player.
 */
function getRaceEmoji(race) {
  switch (race) {
    case 'terran':
      return ':terran:'
    case 'protoss':
      return ':protoss:'
    case 'zerg':
      return ':zerg:'
    default:
      return ':question:'
  }
}

/**
 * Returns a shortened version of the game type string.
 * 
 * This changes a number of the longer game names to an abbreviated version.
 * For example, "Top vs Bottom" is reduced to "TvB".
 */
function getGameTypeString(typeSlug) {
  const gameType = Object.values(gameTypeDefinitions).find(type => type.slug === typeSlug)
  return gameType.name
    .replace(/Top vs Bottom/i, 'TvB')
    .replace(/Free For All/i, 'FFA')
    .replace(/Capture The Flag/i, 'CTF')
    .replace(/Use Map Settings/i, 'UMS')
}

/**
 * Returns the matchup for this game by the list of players.
 * 
 * If there are only two players, the race letters will be sorted.
 */
function getGameMatchup(players) {
  const raceLetters = players.map(player => player.race.slice(0, 1).toUpperCase())
  return (raceLetters.length === 2 ? raceLetters.sort(sortRaces) : raceLetters).join('v')
}

/**
 * Returns a title representing this game.
 * 
 * This will generate a specific format for standard 1v1 games,
 * and a more generic format for all other cases.
 */
function getGameTitle(baseInfo) {
  const mapName = baseInfo.map.name
  const gameType = getGameTypeString(baseInfo.game.type)
  const gameHost = baseInfo.host
  const playerAmount = baseInfo.players.length

  // If there are just two players, this is a 1v1.
  if (playerAmount === 2) {
    const matchup = getGameMatchup(baseInfo.players)
    return `${matchup} ${getPlayerName(baseInfo.players[0])} v. ${getPlayerName(baseInfo.players[1])} @ ${mapName}`
  }

  // In all other cases, return a generic name.
  return `${playerAmount} player ${gameType} hosted by ${gameHost} @ ${mapName}`
}

/**
 * Returns a string representing a player.
 * 
 * This includes their name and an emoji representing their race.
 */
function getPlayerName(playerObj, apm = null, isCpu = false) {
  return `${getRaceEmoji(playerObj.race)} ${playerObj.name}${apm ? ` (${apm} apm)` : ''}${isCpu ? ` (CPU)` : ''}`
}

/**
 * Returns a string of race emojis representing all players in a game.
 */
function getPlayerRaces(players) {
  return players.map(player => getRaceEmoji(player.race)).join('')
}

/**
 * Returns a list of players.
 */
function getPlayerList(players) {
  return players.map(player => {
    return {
      name: player.name,
      apm: player.apm,
      eapm: player.eapm,
      race: player.race,
      isCpu: player.ID === 255,
      nameFormatted: getPlayerName(player, player.apm, player.ID === 255)
    }
  })
}

/**
 * Returns formatted "rich" info about a replay, to easily embed in a Discord message.
 */
export function generateRichInfo(replay, baseInfo, bufferSize, options = {}) {
  return {
    title: getGameTitle(baseInfo),
    game: {
      type: getGameTypeString(baseInfo.game.type),
      matchup: getGameMatchup(baseInfo.players),
      title: baseInfo.game.title
    },
    players: {
      amount: baseInfo.players.length,
      races: getPlayerRaces(baseInfo.players),
      list: getPlayerList(baseInfo.players)
    },
    time: {
      startTime: formatDynamicTimestamp(baseInfo.game.startTime, 'F'),
      startTimeRel: formatDynamicTimestamp(baseInfo.game.startTime, 'R'),
      startTimeEmoji: formatDateClockEmoji(baseInfo.game.startTime),
      duration: baseInfo.game.duration
    },
    map: {
      name: baseInfo.map.name,
      originalName: baseInfo.map.originalName
    },
    file: {
      bytes: bufferSize,
      size: formatFilesize(bufferSize)
    },
    messages: formatChatToCodeBlock(baseInfo.messages, baseInfo.players, options.useSpoilerMessages, options.maxChatLines),
    meta: {
      is1v1: baseInfo.players.length === 2
    }
  }
}
