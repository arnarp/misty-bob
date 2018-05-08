export function isEmpty(obj: {}) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
export function hasOneKey(obj: {}) {
  return Object.keys(obj).length === 1 && obj.constructor === Object;
}
