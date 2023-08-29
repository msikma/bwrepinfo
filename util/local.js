// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import fs from 'fs/promises'

/**
 * Loads a local file and returns its contents as an ArrayBuffer object.
 */
export async function readLocalBuffer(filepath) {
  const data = await fs.readFile(filepath)
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
}
