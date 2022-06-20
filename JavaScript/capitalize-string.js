/**
 * Coloca a primeira letra da String como maiúscula.
 * @param {String} str String a ser capitalizada.
 * @returns String com a primeira letra maiuscula.
 */
export function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}
