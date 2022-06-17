const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

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
 * Constrói página de erro para erros de XmlHttpRequest.
 */
function construirPaginaErroXmlHttpRequest() {
  let htmlString = "";
  htmlString += "<main>";
  htmlString += '<div style="text-align: center;">';
  htmlString += "<h1>Erro ao construir página HTML</h1>";
  htmlString += "<h2>Erro ao realizar 'XMLHttpRequest'</h2>";
  htmlString += `<p style="color: red;">Status: ${this.status}</p>`;
  htmlString += `<p style="color: red;">Status Text:${this.statusText}</p>`;
  htmlString += `<p style="color: red;">Response Text:${this.responseText}</p>`;
  htmlString += "</div>";
  htmlString += "</main>";

  document.body.innerHTML = htmlString;
}

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
   */
  constructor(filme, autor, imagemAutor, avaliacao) {
    this.filme = filme;
    this.autor = autor;
    this.imagemAutor = imagemAutor;
    this.avaliacao = avaliacao;
  }
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
          `https://api.themoviedb.org/3/movie/${dadosDeFilme.id}/reviews?api_key=${API_KEY}`,
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
                reviewDoFilme.author_details.avatar_path,
                reviewDoFilme.content,
              ),
            );
          },
        );
      } catch (e) {
        console.log(e);
      }
    },
  );
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
        htmlString += '<div class="col-6">'; // div4: Inicio

        if (value.video) {}
        else {
          htmlString +=
            `<img class="movie-poster" src="https://image.tmdb.org/t/p/original/${value.poster_path}">`;
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
        htmlString += '<div class="col-3">';
        htmlString += '<a href="#">';
        htmlString +=
          `<img src="https://image.tmdb.org/t/p/original/${value.poster_path}" alt="${value.name}">`;
        htmlString += "</a>";
        htmlString += "</div>";
      },
    );
  }

  document.querySelector("main #section_destaque #cards_filmes_destaque .row")
    .innerHTML = htmlString;
}

onload = function () {
  // Obtendo dados do 'The Movie DB'
  obterDadosDosFilmesEmLancamento();
  obterDadosDosFilmesEmDestaque();
  obterDadosDasAvaliacoes();

  // Construindo pedaços da página HTML
  construirPedacoDaPaginaSobreFilmesEmLancamentos();
  construirPedacoDaPaginaSobreFilmesEmDestaque();
};
