// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import {generateBaseInfo} from './base.js'
import {generateRichInfo} from './rich.js'

/**
 * Generates and returns replay info from the raw replay data.
 * 
 * This generates the "base" info first and then creates more comprehensively
 * formatted "rich" data, which is designed to be used more or less directly,
 * without the need for much formatting or editing.
 */
export function generateRepInfo(replay, bufferSize) {
  const baseInfo = generateBaseInfo(replay)
  const richInfo = generateRichInfo(replay, baseInfo, bufferSize)
  return {
    ...richInfo,
    _baseInfo: baseInfo
  }
}
