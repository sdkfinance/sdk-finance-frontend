export function isJsonStructure(string: string) {
  try {
    const result = JSON.parse(string);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (error) {
    return false;
  }
}
