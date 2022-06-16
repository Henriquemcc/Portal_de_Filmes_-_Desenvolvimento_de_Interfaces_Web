const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

// Em caso de erro na execução da requisição, esta página será construida para exibir a mensagem de erro.
const XML_HTTP_REQUEST_ON_ERROR = function () {
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
};

/**
 * Constrói a página de filmes em lançamento.
 */
function construirFilmesLancamentos() {
  // Criando objeto XMLHttpRequest
  let xmlHttpRequestObject = new XMLHttpRequest();

  // Em caso de erro na execução da requisição, esta página será construida para exibir a mensagem de erro.
  xmlHttpRequestObject.onerror = XML_HTTP_REQUEST_ON_ERROR;

  // Em caso de sucesso na execução da requisição, a página será construida com os dados obtidos por esta função.
  xmlHttpRequestObject.onload = function () {
    // Convertendo string em objeto
    let dados = JSON.parse(this.responseText);

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
  };

  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}`,
  );
  xmlHttpRequestObject.send();
}

/**
 * Constrói a página de filmes em destaque
 */
function construirFilmesEmDestaque() {
  // Criando objeto XMLHttpRequest
  let xmlHttpRequestObject = new XMLHttpRequest();

  // Em caso de erro na execução da requisição, esta página será construida para exibir a mensagem de erro.
  xmlHttpRequestObject.onerror = XML_HTTP_REQUEST_ON_ERROR;

  // Em caso de sucesso na execução da requisição, a página será construida com os dados obtidos por esta função.
  xmlHttpRequestObject.onload = function () {
    // Convertendo string em objeto
    let dados = JSON.parse(this.responseText);

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
  };

  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${LANGUAGE}`,
  );
  xmlHttpRequestObject.send();
}

// Executando as funções de construção de página.
onload = function () {
  construirFilmesLancamentos();
  construirFilmesEmDestaque();
};
