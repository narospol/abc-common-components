export const numbersToCurrency = (numbers, precision = 0) => {
  const exp = Math.pow(10, precision);
  const float = parseFloat(numbers) / exp;
  return float.toFixed(Math.max(0, Math.min(precision, 20)));
};

export const addThousandSeparator = (integer, separator = ",") => {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`);
};

export const unFormat = (value, precision = 0) => {
  const negative = value.indexOf("-") >= 0 ? -1 : 1;
  const str = value ? value.toString() : "";
  const numbers = str.replace(/\D+/g, "") || "0";
  const currency = numbersToCurrency(numbers, precision);
  return parseFloat(currency) * negative;
};

export const getQueryParamFromUrl = (name, url) => {
  /* eslint-disable */
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
  /* eslint-enable */
};

const getObjectValueByPath = (obj, path, fallback) => {
  if (!path || path.constructor !== String) return fallback;
  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  return getNestedValue(obj, path.split("."), fallback);
};

const getNestedValue = (obj, path, fallback) => {
  var last = path.length - 1;
  if (last < 0) return obj === undefined ? fallback : obj;
  for (var i = 0; i < last; i++) {
    if (obj == null) {
      return fallback;
    }
    obj = obj[path[i]];
  }
  if (obj == null) return fallback;
  return obj[path[last]] === undefined ? fallback : obj[path[last]];
};

export const getPropertyFromItem = (item, property, fallback) => {
  if (property == null) return item === undefined ? fallback : item;
  if (item !== Object(item)) return fallback === undefined ? item : fallback;
  if (typeof property === "string")
    return getObjectValueByPath(item, property, fallback);
  if (Array.isArray(property)) return getNestedValue(item, property, fallback);
  if (typeof property !== "function") return fallback;
  var value = property(item, fallback);
  return typeof value === "undefined" ? fallback : value;
};
