// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import orderBy from 'lodash.orderby'
import {speedDefinitions, gameTypeDefinitions, parseMapName, framesToMs} from 'sctoolsdata'
import {formatGameDuration} from '../util/format.js'

// The names of the available game speeds.
const speedKeys = Object.keys(speedDefinitions)

/**
 * Generates the base info; all info that's trivially parsed from the raw data.
 * 
 * This data is then used as a basis from which to generate the "rich" data,
 * which is designed to be used directly without the need for any further formatting.
 * 
 * The data returned by this function is already fairly high level compared to the raw data.
 */
export function generateBaseInfo(replay) {
  const type = gameTypeDefinitions[replay.gameInfo.type]
  const mapName = parseMapName(replay.gameInfo.map)
  const gameDuration = framesToMs(replay.gameInfo.frames, speedKeys[replay.gameInfo.speed])

  const gameInfo = {
    title: replay.gameInfo.title,
    speed: speedKeys[replay.gameInfo.speed],
    type: type.slug,
    startTime: replay.gameInfo.startTime,
    durationMs: gameDuration,
    duration: formatGameDuration(gameDuration)
  }

  const mapInfo = {
    name: mapName.plainName,
    originalName: mapName.cleanNameVersioned,
    width: replay.gameInfo.mapWidth,
    height: replay.gameInfo.mapHeight
  }

  return {
    game: gameInfo,
    players: orderBy(replay.players, 'ID', 'asc'),
    host: replay.gameInfo.host,
    messages: replay.messages,
    map: mapInfo
  }
}
