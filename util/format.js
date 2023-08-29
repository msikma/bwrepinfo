// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import formatDuration from 'format-duration'
import prettyBytes from 'pretty-bytes'

/**
 * Formats the time at which a chat message was sent.
 */
export function formatMessageTime(timeMs, leadingSpace = false) {
  const duration = formatDuration(timeMs, {leading: true})
  return leadingSpace ? duration.replace(/^0/, ' ') : duration
}

/**
 * Formats the duration of the game.
 */
export function formatGameDuration(durationMs) {
  return formatDuration(durationMs, {leading: false})
}

/**
 * Returns a dynamic timestamp string.
 */
export function formatDynamicTimestamp(date, type) {
  return `<t:${Math.floor(Number(date) / 1000)}:${type}>`
}

/**
 * Formats a filesize from bytes into a human readable string.
 */
export function formatFilesize(bytes) {
  return prettyBytes(bytes, {})
}

/**
 * Wraps a string in spoiler tags.
 */
export function wrapSpoiler(str) {
  return `||${str}||`
}

/**
 * Wraps a string in a code block tag.
 */
export function wrapCodeBlock(str, type = '') {
  return `\`\`\`${type}\n${str}\n\`\`\``
}
