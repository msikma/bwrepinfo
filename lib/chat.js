// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

import {formatMessageTime, wrapSpoiler, wrapCodeBlock} from '../util/format.js'

// All available ANSI colors.
const ANSI_COLORS = {
  'Gray': 30,
  'Red': 31,
  'Green': 32,
  'Yellow': 33,
  'Blue': 34,
  'Pink': 35,
  'Cyan': 36,
  'White': 37
}

// The color used if we've run out of colors (note: max players is normally 8).
const FALLBACK_COLOR = 'White'

/**
 * Limits the chat to a maximum number of lines.
 * 
 * This is necessary to prevent the chat log from being too long for an Embed.
 * If the number of messages is within the limit, the original array is returned.
 */
function limitChatMessages(arr, limit, omit) {
  if (arr.length <= limit * 2) {
    return arr
  }
  return [
    ...arr.slice(0, limit),
    omit(arr.length - (limit * 2)),
    ...arr.slice(-limit)
  ]
}

/**
 * Colorizes a string using an ANSI escape sequence.
 */
function formatColorString(str, id) {
  return `\u001b[0;${id}m${str}\u001b[0m`
}

/**
 * Grays out a string by giving it a gray color ANSI escape sequence.
 * 
 * Can be used for notifications, such as the "messages omitted" line.
 */
function formatNoteString(str) {
  return formatColorString(str, ANSI_COLORS['Gray'])
}

/**
 * Formats a series of replay chat messages into a Markdown code block.
 * 
 * This utilizes ANSI escape sequences to colorize the text to be similar to the players'
 * original in-game colors. So if a player was red, their messages will have a red username.
 * 
 * Not all colors have ANSI equivalents, and random colors are used to represent those players.
 * 
 * If the number of chat messages exceeds a threshold, messages in the center will be omitted.
 * The 'maxLines' property determines the threshold; if it's 4, then at most 4 lines at the top
 * and 4 lines at the bottom will be permitted, plus a "(x messages omitted)" line in between.
 */
export function formatChatToCodeBlock(messages, players, useSpoilerMessages = true, maxLines = 4) {
  const assignedPlayers = {}
  const assignedColors = {}
  const allColors = Object.keys(ANSI_COLORS)

  // Assign colors to all players. First we start with the "preferred" colors,
  // which are the ones for which there is a direct ANSI equivalent.
  for (const player of players) {
    const colorName = player.color.name
    const preferredColor = ANSI_COLORS[colorName]
    if (!preferredColor) continue
    assignedPlayers[player.ID] = colorName
    assignedColors[colorName] = player.ID
  }

  // Now assign the rest of the colors to all players without a preferred color.
  // This just gives the next available color one at a time.
  // If there are more than 8 players (which should never happen), all remaining
  // players will get the fallback color.
  for (const player of players) {
    if (assignedPlayers[player.ID]) continue
    const assigned = Object.keys(assignedColors)
    const unusedColors = allColors.filter(key => !assigned.includes(key))
    if (!unusedColors.length) {
      assignedPlayers[player.ID] = FALLBACK_COLOR
      continue
    }
    const colorName = unusedColors[0]
    assignedPlayers[player.ID] = colorName
    assignedColors[colorName] = player.ID
  }

  // Iterate through all messages and format them as a colored string.
  const messagesSubset = limitChatMessages(messages, maxLines,  n => ({note: `(${n} message${n === 1 ? '' : 's'} omitted)`}))
  const messagesColored = []
  for (const message of messagesSubset) {
    // If the chat is long, there will be a "(x messages omitted)" line here.
    // Color it gray if so.
    if (message.note) {
      messagesColored.push(`${formatNoteString(message.note)}`)
      continue
    }
    // Get the player's assigned color and format their message with it.
    const color = assignedPlayers[message.sender.ID]
    const colorId = ANSI_COLORS[color ?? FALLBACK_COLOR]
    messagesColored.push(`${formatNoteString(`[${formatMessageTime(message.timeMs)}]`)} ${formatColorString(`${message.sender.name}:`, colorId)} ${message.message}`)
  }

  // Wrap the chat messages in a code block tagged as ANSI.
  const chatLogMonospace = wrapCodeBlock(messagesColored.join('\n'), 'ansi')

  // Chat messages can spoil the result of a game, so we optionally wrap it in spoiler tags as well.
  return useSpoilerMessages ? wrapSpoiler(chatLogMonospace) : chatLogMonospace
}
