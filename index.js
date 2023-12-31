// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import {generateRepInfo} from './lib/info.js'
import {getRepParsedData} from './lib/parse.js'
import {readLocalBuffer} from './util/local.js'

/**
 * Loads a replay file into an ArrayBuffer and returns its parsed info.
 */
export async function getFileRepInfo(filepath, options = {}) {
  const arrayBuffer = await readLocalBuffer(filepath)
  return getBufferRepInfo(arrayBuffer, options)
}

/**
 * Parses a replay file buffer and returns its parsed info.
 */
export async function getBufferRepInfo(arrayBuffer, options = {}) {
  const bufferSize = arrayBuffer.byteLength
  const replay = await getRepParsedData(arrayBuffer)
  return generateRepInfo(replay, bufferSize, options)
}
