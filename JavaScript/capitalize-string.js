/**
 * Coloca a primeira letra da String como maiúscula.
 * @param {String} str String a ser capitalizada.
 * @returns {string} String com a primeira letra maiúscula.
 */
export function capitalizeString(str)
{
	return str.charAt(0).toUpperCase() + str.substring(1);
}
