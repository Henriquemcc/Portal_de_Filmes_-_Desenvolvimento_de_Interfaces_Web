import { API_KEY, LANGUAGE } from "./JavaScript/constantes.js";
import { construirPaginaErroXmlHttpRequest } from "./JavaScript/construir-pagina-erro-xml-http-request.js";
import { converterUrlImagemTheMovieDb } from "./JavaScript/converter-url-imagem-the-movie-db.js";

/**
 * Armazena os dados obtidos dos filmes em lançamento ('now_playing').
 */
let dadosDosFilmesEmLancamento;

/**
 * Armazena os dados obtidos dos filmes em destaque ('trending').
 */
let dadosDosFilmesEmDestaque;

/**
 * Armazena os dados das avaliações dos filmes.
 */
let avaliacoesDosFilmes = new Array();

/**
 * Obtém do 'The Movie DB' os dados dos filmes em lançamento.
 */
function obterDadosDosFilmesEmLancamento() {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosDosFilmesEmLancamento = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Obtém do 'The Movie DB' os dados dos filmes em destaque.
 */
function obterDadosDosFilmesEmDestaque() {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosDosFilmesEmDestaque = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Classe que representa uma avaliação de um filme.
 */
class Avaliacao {
  /**
   * Constrói uma instância da classe Avaliação.
   * @param {String} filme Nome do filme ou série a ser avaliado.
   * @param {String} autor Nome de quem o avaliou.
   * @param {String} imagemAutor Url da imagem do autor.
   * @param {String} avaliacao Texto da avaliação.
   * @param {Date, String} data Data da avaliação.
   */
  constructor(filme, autor, imagemAutor, avaliacao, data) {
    this.filme = filme;
    this.autor = autor;
    this.imagemAutor = imagemAutor;
    this.avaliacao = avaliacao;

    if (typeof data == "string") {
      this.data = new Date(data);
    } else if (typeof data == "object" && data instanceof Date) {
      this.data = data;
    }
  }
}

/**
 * Compara duas instâncias da classe Avaliacao de acordo com a data.
 * @param {Avaliacao} a Instância da classe Avaliacao a ser comparada com 'b'.
 * @param {Avaliacao} b Instância da classe Avaliacao a ser comparada com 'a'.
 * @returns Valor numérico indicando a diferença entre as datas das avaliações.
 */
function compararObjetosClasseAvaliacaoPorData(a, b) {
  return a.data - b.data;
}

/**
 * Obtém do 'The Movie DB' os dados das avaliações dos filmes em lançamento e em destaque.
 */
function obterDadosDasAvaliacoes() {
  let dadosDosFilmes = new Array();

  if (
    dadosDosFilmesEmDestaque != null && dadosDosFilmesEmDestaque.results != null
  ) {
    dadosDosFilmes = dadosDosFilmes.concat(dadosDosFilmesEmDestaque.results);
  }

  if (
    dadosDosFilmesEmLancamento != null &&
    dadosDosFilmesEmLancamento.results != null
  ) {
    dadosDosFilmes = dadosDosFilmes.concat(dadosDosFilmesEmLancamento.results);
  }

  // Removendo filmes repetidos
  dadosDosFilmes = new Array(...new Set(dadosDosFilmes));

  dadosDosFilmes.forEach(
    (dadosDeFilme) => {
      try {
        // Baixando review do filme
        let xmlHttpRequestObject = new XMLHttpRequest();
        xmlHttpRequestObject.open(
          "GET",
          `https://api.themoviedb.org/3/movie/${dadosDeFilme.id}/reviews?api_key=${API_KEY}&language=${LANGUAGE}`,
          false,
        );
        xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
        xmlHttpRequestObject.send();
        let dadosDosReviewsDoFilme = JSON.parse(
          xmlHttpRequestObject.responseText,
        );

        dadosDosReviewsDoFilme.results.forEach(
          (reviewDoFilme) => {
            avaliacoesDosFilmes.push(
              new Avaliacao(
                dadosDeFilme.title,
                reviewDoFilme.author,
                converterUrlImagemTheMovieDb(
                  reviewDoFilme.author_details.avatar_path,
                ),
                reviewDoFilme.content,
                reviewDoFilme.created_at,
              ),
            );
          },
        );
      } catch (e) {
        console.log(e);
      }
    },
  );

  // Ordenando as avaliações por data.
  avaliacoesDosFilmes.sort(compararObjetosClasseAvaliacaoPorData);
}

/**
 * Constrói o pedaço da página de filmes em lançamento.
 */
function construirPedacoDaPaginaSobreFilmesEmLancamentos() {
  // Construindo HTMLstring
  let htmlString = "";

  // Adicionando filmes
  if (dadosDosFilmesEmLancamento.results != null) {
    dadosDosFilmesEmLancamento.results.forEach(
      (value, index) => {
        if (index == 0) {
          htmlString += `<div class="carousel-item active">`; // div1: Inicio
        } else {
          htmlString += `<div class="carousel-item">`; // div1: Inicio
        }
        htmlString += '<div class="row">'; // div2: Inicio
        htmlString += '<div class="col-6">'; // div3: Inicio
        htmlString += `<h2>${value.title}</h2>`;
        htmlString += `<p>${value.overview}</p>`;
        htmlString += "</div>"; // div3: Fim
        htmlString +=
          '<div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">'; // div4: Inicio

        if (value.video) {}
        else {
          let urlImagem = converterUrlImagemTheMovieDb(value.poster_path);
          if (urlImagem != null) {
            htmlString += `<img class="movie-poster" src="${urlImagem}">`;
          }
        }
        htmlString += "</div>"; // div4: Fim
        htmlString += "</div>"; // div2: Fim
        htmlString += "</div>"; // div1: Fim
      },
    );
  }

  document.querySelector(
    "main #section_lancamentos #carouselLancamentos .carousel-inner",
  ).innerHTML = htmlString;
}

/**
 * Constrói a página de filmes em destaque
 */
function construirPedacoDaPaginaSobreFilmesEmDestaque() {
  // Construindo HTMLstring
  let htmlString = "";

  // Adicionando filmes
  if (dadosDosFilmesEmDestaque.results != null) {
    dadosDosFilmesEmDestaque.results.forEach(
      (value, index) => {
        htmlString +=
          '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">';
        htmlString += '<a href="#">';

        let urlImagem = converterUrlImagemTheMovieDb(value.poster_path);

        if (urlImagem != null) {
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

function construirPedacoDaPaginaSobreUltimasAvaliacoes() {
  // Construindo HTMLString
  let htmlString = "";

  // Adicionando avaliações

  for (let i = avaliacoesDosFilmes.length - 1; i > 0; i--) {
    let avaliacao = avaliacoesDosFilmes[i];

    htmlString += '<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">'; // div1: Inicio
    htmlString += '<div class="card">'; // div2: Inicio
    htmlString += '<div class="card-header">'; // div3: Inicio
    if (avaliacao.imagemAutor != null) {
      htmlString +=
        `<img src="${avaliacao.imagemAutor}" alt="${avaliacao.autor}">`;
    }
    htmlString += `<h2 class="card-title">${avaliacao.autor}</h2>`;
    htmlString += "</div>"; // div3: Fim
    htmlString +=
      `<p class="card-text"><b>${avaliacao.filme}:</b> ${avaliacao.avaliacao}</p>`;
    htmlString += "</div>"; // div2: Fim
    htmlString += "</div>"; // div1: Fim
  }

  document.querySelector(
    "main #section_ultimas_avaliacoes #cards_ultimas_avaliacoes > div",
  ).innerHTML = htmlString;
}

onload = function () {
  // Obtendo dados do 'The Movie DB'
  obterDadosDosFilmesEmLancamento();
  obterDadosDosFilmesEmDestaque();
  obterDadosDasAvaliacoes();

  // Construindo pedaços da página HTML
  construirPedacoDaPaginaSobreFilmesEmLancamentos();
  construirPedacoDaPaginaSobreFilmesEmDestaque();
  construirPedacoDaPaginaSobreUltimasAvaliacoes();
};
