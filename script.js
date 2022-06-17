const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

/**
 * Armazena os dados obtidos dos filmes em lançamento ('now_playing').
 */
let dadosFilmesLancamentos;

/**
 * Armazena os dados obtidos dos filmes em destaque ('trending').
 */
let dadosFilmesDestaque;

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
function obterDadosFilmesLancamento() {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosFilmesLancamentos = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Obtém do 'The Movie DB' os dados dos filmes em destaque.
 */
function obterDadosFilmesDestaque() {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosFilmesDestaque = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Constrói a página de filmes em lançamento.
 */
function construirFilmesLancamentos() {
  // Convertendo string em objeto
  let dados = dadosFilmesLancamentos;

  // Construindo HTMLstring
  let htmlString = "";

  // Adicionando filmes
  if (dados.results != null) {
    dados.results.forEach(
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
function construirFilmesEmDestaque() {
  // Convertendo string em objeto
  let dados = dadosFilmesDestaque;

  // Construindo HTMLstring
  let htmlString = "";

  // Adicionando filmes
  if (dados.results != null) {
    dados.results.forEach(
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
  obterDadosFilmesLancamento();
  obterDadosFilmesDestaque();

  // Construindo pedaços da página HTML
  construirFilmesLancamentos();
  construirFilmesEmDestaque();
};
