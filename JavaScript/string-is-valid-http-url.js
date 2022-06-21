/**
 * Verifica se uma string é uma URL http válida.
 * @param {String} str String a ser verificada.
 * @return {Boolean} Valor booleano indicando se a String passada é uma URL http válida.
 */
export function stringIsValidHttpUrl(str)
{
	try
	{
		let url = new URL(str);
		return url.protocol === "http:" || url.protocol === "https:";
	}
	catch (e)
	{
		console.log(e);
	}

	return false;
}
