import get from "lodash/get";

const CONFIG_KEY = "__config__";

export function hasConfig(value) {
  return typeof value === "object" && typeof value[CONFIG_KEY] === "object";
}

export function getConfig(obj) {
  return get(obj, CONFIG_KEY, {});
}

export function getValueFromData(data, obj) {
  const config = getConfig(obj);

  return get(data, config.from);
}
