import {LANGUAGE, MOVIE_DB_API_KEY} from "./JavaScript/constantes.js";
import {construirPaginaErroXmlHttpRequest} from "./JavaScript/construir-pagina-erro-xml-http-request.js";
import {converterUrlImagemTheMovieDb} from "./JavaScript/converter-url-imagem-the-movie-db.js";

/**
 * Obtém do 'The Movie DB' os dados dos filmes em lançamento.
 * @param {String} api_key Chave de API do 'The Movie DB'.
 * @param {String} language Linguagem a ser mostrada o resultado.
 * @returns {Object} Objeto contendo os dados dos filmes em lançamento.
 */
function obterDadosDosFilmesEmLancamento(api_key, language)
{
	let url = new URL("https://api.themoviedb.org/3/movie/now_playing");
	url.searchParams.set("api_key", api_key);
	url.searchParams.set("language", language);

	let xmlHttpRequestObject;
	try
	{
		xmlHttpRequestObject = new XMLHttpRequest();
		xmlHttpRequestObject.open("GET", url, false);
		xmlHttpRequestObject.send();
		return JSON.parse(xmlHttpRequestObject.responseText);
	}
	catch (e)
	{
		construirPaginaErroXmlHttpRequest({xmlHttpRequestObject: xmlHttpRequestObject});
		console.log(e);
	}

	return null;
}

/**
 * Obtém do 'The Movie DB' os dados dos filmes em destaque.
 * @param {string} api_key Chave de API do 'The Movie DB'.
 * @param {string} language Linguagem a ser mostrada o resultado.
 * @returns {Object} Objeto contendo os dados dos filmes em destaque.
 */
function obterDadosDosFilmesEmDestaque(api_key, language)
{
	let url = new URL("https://api.themoviedb.org/3/trending/all/week");
	url.searchParams.set("api_key", api_key);
	url.searchParams.set("language", language);

	let xmlHttpRequestObject;
	try
	{
		xmlHttpRequestObject = new XMLHttpRequest();
		xmlHttpRequestObject.open("GET", url, false);
		xmlHttpRequestObject.send();
		return JSON.parse(xmlHttpRequestObject.responseText);
	}
	catch (e)
	{
		construirPaginaErroXmlHttpRequest({xmlHttpRequestObject: xmlHttpRequestObject});
		console.log(e);
	}

	return null;
}

/**
 * Classe que representa uma avaliação de um filme.
 */
class Avaliacao
{
	/**
	 * Constrói uma instância da classe Avaliação.
	 * @param {String} filme Nome do filme ou série a ser avaliado.
	 * @param {String} autor Nome de quem o avaliou.
	 * @param {String} imagemAutor Url da imagem do autor.
	 * @param {String} avaliacao Texto da avaliação.
	 * @param {Date, String} data Data da avaliação.
	 */
	constructor(filme, autor, imagemAutor, avaliacao, data)
	{
		this.filme = filme;
		this.autor = autor;
		this.imagemAutor = imagemAutor;
		this.avaliacao = avaliacao;

		if (typeof data == "string")
		{
			this.data = new Date(data);
		}
		else if (typeof data == "object" && data instanceof Date)
		{
			this.data = data;
		}
	}
}

/**
 * Compara duas instâncias da classe Avaliacao de acordo com a data.
 * @param {Avaliacao} a Instância da classe Avaliacao a ser comparada com 'b'.
 * @param {Avaliacao} b Instância da classe Avaliacao a ser comparada com 'a'.
 * @returns {Number} Valor numérico indicando a diferença entre as datas das avaliações.
 */
function compararObjetosClasseAvaliacaoPorData(a, b)
{
	return a.data - b.data;
}

/**
 * Obtém do 'The Movie DB' os dados das avaliações dos filmes em lançamento e em destaque.
 * @param {Array} dadosDosFilmes Dados dos filmes em lançamento e em destaque combinados.
 * @returns {Array} Dados das avaliações dos filmes.
 */
function obterDadosDasAvaliacoes(dadosDosFilmes, api_key, language)
{
	// Removendo filmes repetidos
	dadosDosFilmes = new Array(...new Set(dadosDosFilmes));

	// Dados das avaliações dos filmes
	let avaliacoesDosFilmes = [];

	dadosDosFilmes.forEach(
		(dadosDeFilme) =>
		{
			try
			{
				let url = new URL(`https://api.themoviedb.org/3/movie/${dadosDeFilme.id}/reviews`);
				url.searchParams.set("api_key", api_key);
				url.searchParams.set("language", language);

				// Baixando review do filme
				let xmlHttpRequestObject = new XMLHttpRequest();
				xmlHttpRequestObject.open("GET", url, false);
				xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
				xmlHttpRequestObject.send();
				let dadosDosReviewsDoFilme = JSON.parse(xmlHttpRequestObject.responseText);

				if (dadosDosReviewsDoFilme != null && dadosDosReviewsDoFilme.results != null)
				{
					dadosDosReviewsDoFilme.results.forEach(
						(reviewDoFilme) =>
						{
							avaliacoesDosFilmes.push(new Avaliacao(dadosDeFilme.title, reviewDoFilme.author, converterUrlImagemTheMovieDb(reviewDoFilme.author_details.avatar_path,), reviewDoFilme.content, reviewDoFilme.created_at));
						},
					);
				}
			}
			catch (e)
			{
				console.log(e);
			}
		},
	);

	// Ordenando as avaliações por data.
	avaliacoesDosFilmes.sort(compararObjetosClasseAvaliacaoPorData);

	return avaliacoesDosFilmes;
}

/**
 * Constrói a parte da página com os filmes em lançamento.
 * @param {Object} dados Dados obtidos do 'The Movie DB' sobre os filmes em lançamento.
 */
function construirPedacoDaPaginaSobreFilmesEmLancamentos(dados)
{
	// Construindo HTMLstring
	let htmlStringConteudoCarrousel = "";
	let htmlStringBotoesCarrousel = "";

	// Adicionando filmes
	if (dados.results != null)
	{
		dados.results.forEach(
			(value, index) =>
			{
				// Adicionando conteúdo ao carrousel
				if (index === 0)
				{
					htmlStringConteudoCarrousel += `<div class="carousel-item active">`; // div1: Inicio
				}
				else
				{
					htmlStringConteudoCarrousel += `<div class="carousel-item">`; // div1: Inicio
				}
				htmlStringConteudoCarrousel += '<div class="row">'; // div2: Inicio
				htmlStringConteudoCarrousel += '<div class="col-6">'; // div3: Inicio
				htmlStringConteudoCarrousel += `<h2>${value.title}</h2>`;
				htmlStringConteudoCarrousel += `<p>${value.overview}</p>`;
				htmlStringConteudoCarrousel += `<a href="./filme/?id=${value.id}"><p>Mais informações</p></a>`;
				htmlStringConteudoCarrousel += "</div>"; // div3: Fim
				htmlStringConteudoCarrousel += '<div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">'; // div4: Inicio

				if (value.video)
				{
				}
				else
				{
					let urlImagem = converterUrlImagemTheMovieDb(value.poster_path);
					if (urlImagem != null)
					{
						htmlStringConteudoCarrousel += `<img class="movie-poster" src="${urlImagem}" alt="${value.title}">`;
					}
				}
				htmlStringConteudoCarrousel += "</div>"; // div4: Fim
				htmlStringConteudoCarrousel += "</div>"; // div2: Fim
				htmlStringConteudoCarrousel += "</div>"; // div1: Fim

				// Adicionando botões ao carrousel
				if (index === 0)
				{
					htmlStringBotoesCarrousel += `<button type="button" data-bs-target="#carouselLancamentos" data-bs-slide-to="${index}" class="active" aria-current="true" aria-label="Lançamento ${index + 1}"></button>`;
				}
				else
				{
					htmlStringBotoesCarrousel += `<button type="button" data-bs-target="#carouselLancamentos" data-bs-slide-to="${index}" aria-label="Lançamento ${index + 1}"></button>`;
				}
			},
		);
	}

	document.querySelector("main #section_lancamentos #carouselLancamentos .carousel-inner").innerHTML = htmlStringConteudoCarrousel;

	document.querySelector("#carouselLancamentos > div.row.botoes_carousel > div > div").innerHTML = htmlStringBotoesCarrousel;
}

/**
 * Constrói a parte da página de filmes em destaque
 * @param {Array} dados Dados obtidos do 'The Movie DB' sobre os filmes em destaque.
 */
function construirPedacoDaPaginaSobreFilmesEmDestaque(dados)
{
	// Construindo HTMLstring
	let htmlString = "";

	// Adicionando filmes
	if (
		dados != null && dados.results != null
	)
	{
		dados.results.forEach(
			(value) =>
			{
				let url;
				if (value.media_type === "tv")
				{
					url = `./programa-de-tv/?id=${value.id}`;
				}
				else if (value.media_type === "movie")
				{
					url = `./filme/?id=${value.id}`;
				}
				htmlString += '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">';
				htmlString += `<a href="${url}">`;

				let urlImagem = converterUrlImagemTheMovieDb(value.poster_path);

				if (urlImagem != null)
				{
					htmlString += `<img src="${urlImagem}" alt="${value.name}">`;
				}

				htmlString += "</a>";
				htmlString += "</div>";
			},
		);
	}

	document.querySelector("main #section_destaque #cards_filmes_destaque .row")
		.innerHTML = htmlString;
}

/**
 * Constrói a parte da página com as últimas avaliações.
 * @param {Object} dados Dados das últimas avaliações dos filmes.
 */
function construirPedacoDaPaginaSobreUltimasAvaliacoes(dados)
{
	// Construindo HTMLString
	let htmlString = "";

	// Adicionando avaliações

	for (let i = dados.length - 1; i > 0; i--)
	{
		let avaliacao = dados[i];

		htmlString += '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">'; // div1: Inicio
		htmlString += '<div class="card">'; // div2: Inicio
		htmlString += '<div class="card-header">'; // div3: Inicio
		if (avaliacao.imagemAutor != null)
		{
			htmlString += `<img src="${avaliacao.imagemAutor}" alt="${avaliacao.autor}">`;
		}
		htmlString += `<h2 class="card-title">${avaliacao.autor}</h2>`;
		htmlString += "</div>"; // div3: Fim
		htmlString += `<p class="card-text"><b>${avaliacao.filme}:</b> ${avaliacao.avaliacao}</p>`;
		htmlString += "</div>"; // div2: Fim
		htmlString += "</div>"; // div1: Fim
	}

	document.querySelector("main #section_ultimas_avaliacoes #cards_ultimas_avaliacoes > div").innerHTML = htmlString;
}

onload = () =>
{

	/**
	 * Armazena os dados obtidos dos filmes em lançamento ('now_playing').
	 */

		// Obtendo dados dos filmes em lançamento ('now_playing')
	let dadosDosFilmesEmLancamento = obterDadosDosFilmesEmLancamento(MOVIE_DB_API_KEY, LANGUAGE);

	// Obtendo dados dos filmes em destaque ('trending')
	let dadosDosFilmesEmDestaque = obterDadosDosFilmesEmDestaque(MOVIE_DB_API_KEY, LANGUAGE);

	// Obtendo dados das avaliações dos filmes
	let avaliacoesDosFilmes = obterDadosDasAvaliacoes(dadosDosFilmesEmDestaque.results.concat(dadosDosFilmesEmLancamento.results), MOVIE_DB_API_KEY, LANGUAGE);

	// Construindo a parte de filmes em lançamento
	construirPedacoDaPaginaSobreFilmesEmLancamentos(dadosDosFilmesEmLancamento);

	// Construindo a parte de filmes em destaque
	construirPedacoDaPaginaSobreFilmesEmDestaque(dadosDosFilmesEmDestaque);

	// Construindo a parte das últimas avaliações
	construirPedacoDaPaginaSobreUltimasAvaliacoes(avaliacoesDosFilmes);
};
