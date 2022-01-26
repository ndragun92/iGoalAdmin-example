export function titleCase(text) {
  return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
}
export function getImage(image) {
  return `${process.env.VUE_APP_S3_PATH}${image}`;
}
