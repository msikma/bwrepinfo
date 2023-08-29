// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import {ReplayParser} from 'screparsed'

/**
 * Parses a replay file using screparsed and returns the data.
 * 
 * This returns all (most of) the raw information from the replay file itself,
 * without any additional processing.
 */
export async function getRepParsedData(arrayBuffer) {
  const parser = ReplayParser.fromArrayBuffer(arrayBuffer)
  const data = await parser.parse()
  return {
    gameInfo: data.gameInfo,
    players: data.players,
    messages: data.chatMessages,
  }
}
