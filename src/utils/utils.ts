export function throttle<T> (func: (e: T) => any, wait: number) {
  let previous = 0
  return function (this: any, e: T):any {
    const now = +new Date()
    if ((now - previous) > wait) {
      const result = func.apply(this, [e])
      previous = now
      return result
    }
  }
}
