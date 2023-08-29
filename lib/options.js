// bwrepinfo <https://github.com/msikma/hydrabot>
// © MIT license

const defaultOptions = {
  useSpoilerMessages: true,
  maxChatLines: 5
}

/**
 * Merges the default options in with the user's options.
 */
export function resolveOptions(userOptions = {}) {
  return {...defaultOptions, ...userOptions}
}
