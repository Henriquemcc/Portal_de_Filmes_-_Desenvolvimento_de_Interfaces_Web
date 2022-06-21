/**
 * Converte uma string numérica no formato português Brasil em um número.
 * @param {String} str String a ser convertida em um número.
 * @returns {Number} Número resultado da conversão da string numérica.
 */
function converterStringEmPortuguesBrasilParaNumero(str)
{
	if (str.includes("."))
	{
		str = str.replace(".", "");
	}

	if (str.includes(","))
	{
		str = str.replace(",", ".");
	}

	return parseFloat(str);
}
