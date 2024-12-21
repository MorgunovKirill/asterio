export type Nullable<T> = T | null

export const convertTime = (time: number) => {
  const minutes = Math.floor(time / 60000)
  const seconds = Number(((time % 60000) / 1000).toFixed(0))

  return seconds == 60 ? minutes + 1 + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
