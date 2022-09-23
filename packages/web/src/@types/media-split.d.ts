declare module 'media-split' {
  export default class MediaSplit {
    constructor (options)
    parse(): Promise<Array<Track>>
  }
  export type Track = {
    name: string
    start: string
    end: string
    trackName: string
  }
};