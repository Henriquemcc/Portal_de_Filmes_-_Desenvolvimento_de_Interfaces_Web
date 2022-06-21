import {LANGUAGE, MOVIE_DB_API_KEY} from "../JavaScript/constantes.js";
import {converterUrlImagemTheMovieDb} from "../JavaScript/converter-url-imagem-the-movie-db.js";

/**
 * Obtém do 'The Movie DB' os dados encontrados com a(s) palavra(s) pesquisada(s).
 * @param {String} query Palavra(s) pesquisada(s).
 * @param {String} api_key Chave de API do 'The Movie DB'.
 * @param {String} language Linguagem a ser mostrada o resultado.
 * @returns {Object} Objeto contendo os dados da pesquisa.
 */
function obterDadosDaPesquisa(query, api_key, language)
{
    let url = new URL('https://api.themoviedb.org/3/search/multi');
    url.searchParams.set("api_key", api_key);
    url.searchParams.set("language", language);
    url.searchParams.set("query", query);

    let xmlHttpRequestObject;
    try
    {
        xmlHttpRequestObject = new XMLHttpRequest();
        xmlHttpRequestObject.open("GET", url, false);
        xmlHttpRequestObject.send();
        return JSON.parse(xmlHttpRequestObject.responseText);
    }
    catch (e) {
        console.log(e);
    }

    return null;
}

/**
 * Obtém do navegador do usuário o valor do parâmetro 'search'.
 * @returns {String} Valor do parâmetro 'search'.
 */
function obterQueryStringPesquisa()
{
	let url = new URL(window.location.href);
	return url.searchParams.get("search");
}

/**
 * Constrói a página com os dados da pesquisa.
 * @param {Object} dados Dados obtidos do 'The Movie DB' sobre a pesquisa.
 */
function construirPaginaComDadosDaPesquisa(dados)
{
	let htmlString = "";

	dados.results.forEach(
		(resultadoPesquisa) =>
		{
			htmlString += '<div class="row">';
			htmlString += '<div class="box-resultado">';

			let tipoConteudo;
			let titulo;
			let tituloOriginal;
			let descricao;
			switch (resultadoPesquisa.media_type)
			{
				case "movie":
					tipoConteudo = "Filme";
					titulo = resultadoPesquisa.title;
					tituloOriginal = resultadoPesquisa.original_title;
					descricao = resultadoPesquisa.overview;
					break;
				case "tv":
					tipoConteudo = "Programa de TV";
					titulo = resultadoPesquisa.name;
					tituloOriginal = resultadoPesquisa.original_name;
					descricao = resultadoPesquisa.overview;
					break;
			}

			// Exibindo a imagem
			let urlImagem = converterUrlImagemTheMovieDb(resultadoPesquisa.poster_path);
			if (urlImagem != null)
			{
				htmlString += `<img src="${urlImagem}" alt="${titulo}">`;
			}

			// Exibindo o tipo de conteúdo
			if (tipoConteudo != null)
			{
				htmlString += `<span class="tipo-conteudo">${tipoConteudo}</span><br>`;
			}

			// Exibindo o titulo original
			if (tituloOriginal != null)
			{
				htmlString += `<span class="titulo-original">${tituloOriginal}</span><br>`;
			}

			// Exibindo o título
			if (titulo != null)
			{
				htmlString += `<span class="titulo">${titulo}</span><br>`;
			}

			// Exibindo a descrição
			if (descricao != null)
			{
				htmlString += `<span class="descricao">${descricao}</span><br>`;
			}

			// Adicionando o link de mais informações
			if (resultadoPesquisa.media_type != null && resultadoPesquisa.id != null)
			{
				let url;
				if (resultadoPesquisa.media_type === "tv")
				{
					url = `../programa-de-tv/?id=${resultadoPesquisa.id}`;
				}
				else if (resultadoPesquisa.media_type === "movie")
				{
					url = `../filme/?id=${resultadoPesquisa.id}`;
				}

				htmlString += `<a href="${url}"><span class="mais-informacoes">Mais informações</a>`;
			}
			htmlString += "</div>";
			htmlString += "</div>";
		},
	);

	document.querySelector("#section_resultado_pesquisa").innerHTML = htmlString;
}

onload = () =>
{
	// Obtendo a queryString 'search' da página atual
	let pesquisa = obterQueryStringPesquisa();

	// Adicionando a queryString 'search' á barra de pesquisa
	document.querySelector("#search-bar").value = pesquisa;

	// Obtendo os dados da pesquisa
	let dadosDaPesquisa = obterDadosDaPesquisa(pesquisa, MOVIE_DB_API_KEY, LANGUAGE);

	// Construindo a página
	construirPaginaComDadosDaPesquisa(dadosDaPesquisa);
};
