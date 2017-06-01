export function reduce (arr, callback, data) {
  if (arr.reduce) {
    return arr.reduce(callback, data)
  }

  for (let i = 0; i < arr.length; i++) {
    data = callback(data, arr[i])
  }

  return data
}

export function keys (obj) {
  if (obj.keys) {
    return obj.keys()
  }

  const keys = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key)
    }
  }

  return keys
}

export function map (arr, callback) {
  if (arr.map) {
    return arr.map(callback)
  }

  const ret = []
  for (let i = 0; i < arr.length; i++) {
    ret.push(callback(arr[i], i))
  }

  return ret
}

export function forEach (arr, callback) {
  if (arr.forEach) {
    arr.forEach(callback)
    return
  }

  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i)
  }
}
