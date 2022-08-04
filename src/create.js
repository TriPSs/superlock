'use strict'

module.exports = (slots = 1) => {
  const queue = []

  const release = () => {
    ++slots
    if (queue.length > 0) queue.shift()()
  }

  const acquire = resolve => () => {
    --slots
    resolve(release)
  }

  const lock = () =>
    new Promise(resolve => {
      const fn = acquire(resolve)
      lock.isLocked() ? queue.push(fn) : fn()
    })

  lock.isLocked = () => slots === 0

  return lock
}