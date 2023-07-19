

export function setColorOpacity(color, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

export function getPathWithParams(endPoint) {
  var args = Array.prototype.slice.call(arguments, 1)
  var count = -1;
  return endPoint.replace(/:[a-zA-Z?]+/g, (match) => {
    count += 1;
    return args[count] !== undefined ? args[count] : match;
  });
}