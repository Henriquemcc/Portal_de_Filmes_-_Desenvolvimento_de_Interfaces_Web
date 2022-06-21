import {LANGUAGE, MOVIE_DB_API_KEY} from "../JavaScript/constantes.js";
import {converterUrlImagemTheMovieDb} from "../JavaScript/converter-url-imagem-the-movie-db.js";
import {converterNumeroParaStringEmPortuguesBrasil} from "../JavaScript/converter-numero-para-string-portugues-brasil.js";
import {converterCodigoLinguaIso6391ParaPortuguesBrasil, converterCodigoPaisIso6391ParaPortuguesBrasil,} from "../JavaScript/converter-codigo-iso-639-1-para-portugues-brasil.js";
import {capitalizeString} from "../JavaScript/capitalize-string.js";

/**
 * Obtém do navegador do usuário o valor do parâmetro 'id'.
 * @returns {String} Valor do parâmetro 'id'.
 */
function obterQueryStringId()
{
	let url = new URL(window.location.href);
	return url.searchParams.get("id");
}

/**
 * Obtém do 'The Movie DB' os dados do programa de tv.
 * @param {String, Number} id ID do programa de tv.
 * @param {String} api_key Chave de API do 'The Movie DB'.
 * @param {String} language Linguagem a ser mostrada o resultado.
 * @returns {Object} Objeto contendo os dados do programa de tv.
 */
function obterDadosDoProgramaDeTv(id, api_key, language)
{
	let url = new URL(`https://api.themoviedb.org/3/tv/${id}`);
	url.searchParams.set("api_key", api_key);
	url.searchParams.set("language", language);

	let xmlHttpRequestObject;
	try
	{
		xmlHttpRequestObject = new XMLHttpRequest();
		xmlHttpRequestObject.open("GET", url, false,);
		xmlHttpRequestObject.send();
		return JSON.parse(xmlHttpRequestObject.responseText);
	}
	catch (e) {
		console.log(e);
	}
}

/**
 * Constrói a página com os dados do programa de TV.
 * @param {Object} dados Dados obtidos do 'The Movie DB' sobre o programa de tv.
 */
function construirPaginaComDadosDoProgramaDeTv(dados)
{
	let htmlString = "";

	htmlString += '<div class="row">';

	// Título e ano
	if (dados.name != null)
	{
		htmlString += `<h1 class="titulo"><strong>${dados.name}</strong> `;

		// Adicionando título á página
		document.querySelector("title").innerText = dados.name;

		// Ano
		if (
			dados.first_air_date != null &&
			dados.last_air_date != null
		)
		{
			let dataInicio = new Date(dados.first_air_date);
			let dataFim = new Date(dados.last_air_date);

			if (dataInicio.getFullYear() === dataFim.getFullYear())
			{
				htmlString += `(${dataInicio.getFullYear()})`;
			}
			else
			{
				htmlString += `(${dataInicio.getFullYear()}-${dataFim.getFullYear()})`;
			}
		}

		htmlString += "</h1>";
	}

	// Imagem
	let urlImagem = converterUrlImagemTheMovieDb(dados.poster_path);
	if (urlImagem != null)
	{
		htmlString += `<img src="${urlImagem}" alt="${dados.title}">`;
	}

	// Nome Original
	if (dados.original_name != null)
	{
		htmlString += '<span class="titulo-original chave">Nome Original:</span>';
		htmlString += `<span class="titulo-original valor">${dados.original_name}.</span><br>`;
	}

	// Adulto
	if (dados.adult != null)
	{
		let adultoStr;
		if (dados.adult)
		{
			adultoStr = "Sim";
		}
		else
		{
			adultoStr = "Não";
		}
		htmlString += '<span class="adulto chave">Adulto: </span>';
		htmlString += `<span class="adulto valor">${adultoStr}.</span><br>`;
	}

	// Descrição
	if (dados.overview != null)
	{
		htmlString += '<span class="descricao chave">Sinopse: </span>';
		htmlString += `<span class="descricao valor">${dados.overview}</span><br>`;
	}

	// Língua original
	if (dados.original_language != null)
	{
		let linguaOriginal = capitalizeString(converterCodigoLinguaIso6391ParaPortuguesBrasil(dados.original_language));

		htmlString += '<span class="lingua-original chave">Língua Original:</span>';
		htmlString += `<span class="lingua-original valor">${linguaOriginal}.</span><br>`;
	}

	// Línguas faladas
	if (dados.spoken_languages != null)
	{
		let linguasFaladasArray = [];
		dados.spoken_languages.forEach(
			(spoken_language) =>
			{
				linguasFaladasArray.push(capitalizeString(converterCodigoLinguaIso6391ParaPortuguesBrasil(spoken_language.iso_639_1)));
			},
		);
		let linguasFaladasString = "";
		for (let i = 0; i < linguasFaladasArray.length; i++)
		{
			linguasFaladasString += linguasFaladasArray[i];
			if (i === linguasFaladasArray.length - 2)
			{
				linguasFaladasString += " e ";
			}
			else if (i < linguasFaladasArray.length - 1)
			{
				linguasFaladasString += ", ";
			}
		}
		htmlString += '<span class="liguas-faladas chave">Lígua(s) Falada(s):</span>';
		htmlString += `<span class="liguas-faladas valor">${linguasFaladasString}.</span><br>`;
	}

	// Populariade
	if (dados.popularity != null)
	{
		let popularidade = converterNumeroParaStringEmPortuguesBrasil(dados.popularity);
		htmlString += '<span class="popularidade chave">Popularidade:</span>';
		htmlString += `<span class="popularidade valor">${popularidade}.</span><br>`;
	}

	// Empresas produtoras
	if (dados.production_companies != null)
	{
		let empresasProdutorasArray = [];

		dados.production_companies.forEach(
			(production_company) =>
			{
				empresasProdutorasArray.push(production_company.name);
			},
		);

		let empresasProdutorasString = "";
		for (let i = 0; i < empresasProdutorasArray.length; i++)
		{
			empresasProdutorasString += empresasProdutorasArray[i];
			if (i === empresasProdutorasArray.length - 2)
			{
				empresasProdutorasString += " e ";
			}
			else if (i < empresasProdutorasArray.length - 1)
			{
				empresasProdutorasString += ", ";
			}
		}
		htmlString += '<span class="empresas-producao chave">Produtora(s):</span>';
		htmlString += `<span class="empresas-producao valor">${empresasProdutorasString}.</span><br>`;
	}

	// País de produção
	if (dados.production_countries != null)
	{
		let paisProducaoArray = [];

		dados.production_countries.forEach(
			(production_country) =>
			{
				paisProducaoArray.push(converterCodigoPaisIso6391ParaPortuguesBrasil(production_country.iso_3166_1));
			},
		);

		let paisProducaoString = "";
		for (let i = 0; i < paisProducaoArray.length; i++)
		{
			paisProducaoString += paisProducaoArray[i];
			if (i === paisProducaoArray.length - 2)
			{
				paisProducaoString += " e ";
			}
			else if (i < paisProducaoArray.length - 1)
			{
				paisProducaoString += ", ";
			}
		}

		htmlString += '<span class="paises-producao chave">País(es) de produção:</span>';
		htmlString += `<span class="paises-producao">${paisProducaoString}.</span><br>`;
	}

	htmlString += "</div>";

	document.querySelector("#section_dados_programa_de_tv").innerHTML = htmlString;
}

onload = () =>
{
	// Obtendo a queryString 'id' da página atual
	let id = obterQueryStringId();

	// Obtendo os dados do programa de tv
	let dadosDoProgramaDeTv = obterDadosDoProgramaDeTv(id, MOVIE_DB_API_KEY, LANGUAGE);

	// Construindo a página com os dados do de tv
	construirPaginaComDadosDoProgramaDeTv(dadosDoProgramaDeTv);
};
