const types = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ')
const class2type = {}

for (let i = 0; i < types.length; i++) {
  class2type['[object ' + types[i] + ']'] = types[i].toLowerCase()
}

export default function type (obj) {
  if (obj === null) {
    return obj + ''
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}
