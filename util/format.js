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
 * Returns a clock emoji for a given date.
 */
export function formatDateClockEmoji(date) {
  const clockEmoji = {
    '1': '🕐',
    '2': '🕑',
    '3': '🕒',
    '4': '🕓',
    '5': '🕔',
    '6': '🕕',
    '7': '🕖',
    '8': '🕗',
    '9': '🕘',
    '10': '🕙',
    '11': '🕚',
    '12': '🕛',
    '130': '🕜',
    '230': '🕝',
    '330': '🕞',
    '430': '🕟',
    '530': '🕠',
    '630': '🕡',
    '730': '🕢',
    '830': '🕣',
    '930': '🕤',
    '1030': '🕥',
    '1130': '🕦',
    '1230': '🕧'
  }
  const hours = date.getUTCHours() % 12
  const minutes = date.getUTCMinutes()
  const thirty = minutes >= 30
  const key = `${hours === 0 ? '12' : hours}${thirty ? '30' : ''}`
  return clockEmoji[key]
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
  return prettyBytes(bytes, {binary: true})
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

/**
 * Escapes a string inside of a code or link block.
 * 
 * We can't properly escape values inside of ``` or []() code fragments,
 * so instead we replace control characters with lookalikes.
 * 
 * This only applies to Markdown styles that are *not* at the start of a newline.
 */
export function escapeInsideBlock(str) {
  return str
    .replace(/\*/g, '∗')
    .replace(/|/g, 'ǀ')
    .replace(/_/g, '_')
    .replace(/`/g, ' ̀')
    .replace(/~/g, '∼')
}
