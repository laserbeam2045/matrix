
declare module Events {
  export type MouseTouch = (MouseEvent | TouchEvent) & {
    pageX: number
    pageY: number
    screenX: number
    screenY: number
    clientX: number
    clientY: number
  }
}
