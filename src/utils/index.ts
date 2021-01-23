export const storageKeys = {};
export function getItemByJSONParse(item: string, api = "sessionStorage") {
  try {
    return JSON.parse(window[api].getItem(item));
  } catch (e) {
    return null;
  }
}
