/**
 * Converte um número para uma String formatada com vírgula e pontos de acordo com o padrão do Português do Brasil.
 * @param {Number} numero Número a ser formatado.
 * @return {String} Representação string do número formatado em Português do Brasil.
 */
export function converterNumeroParaStringEmPortuguesBrasil(numero)
{
	let stringNumerica = numero.toString();

	// Separando a parte inteira da parte decimal
	let [stringNumericaParteInteira, stringNumericaParteDecimal] = stringNumerica.split(".");

	let novaStringNumerica = "";
	let contador = 0;
	for (let i = stringNumericaParteInteira.length - 1; i >= 0; i--)
	{
		if (++contador > 3)
		{
			novaStringNumerica = "." + novaStringNumerica;
			contador = 1;
		}
		novaStringNumerica = stringNumericaParteInteira[i] + novaStringNumerica;
	}

	if (stringNumericaParteDecimal != null)
	{
		novaStringNumerica = novaStringNumerica + "," + stringNumericaParteDecimal;
	}

	return novaStringNumerica;
}
