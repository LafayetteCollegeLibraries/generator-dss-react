module.exports.bool = function bool (val) {
  if (val === undefined) {
    return val
  }

  return val && (val === 'false' || val === 'no' || val === '0')
    ? false
    : true
}
