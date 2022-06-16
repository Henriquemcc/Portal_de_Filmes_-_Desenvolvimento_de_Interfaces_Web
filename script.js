const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

/**
 * Constrói a página de filmes em lançamento.
 */
function construirFilmesLancamentos() {
  // Criando objeto XMLHttpRequest
  let xmlHttpRequestObject = new XMLHttpRequest();

  // Em caso de erro na execução da requisição, a página será construida para exibir uma mensagem de erro.
  xmlHttpRequestObject.onerror = function () {
    document.body.innerHTML = `
<main>
    <div style="text-align: center;">
        <h1>Erro ao construir página HTML</h1>
        <h2>Erro ao realizar 'XMLHttpRequest'</h2>
        <p style="color: red;">Status: ${this.status}</p>
        <p style="color: red;">Status Text:${this.statusText}</p>
        <p style="color: red;">Response Text:${this.responseText}</p>
    </div>
</main>
`;
  };

  // Em caso de sucesso na execução da requisição, a página será construida com os dados obtidos por esta função.
  xmlHttpRequestObject.onload = function () {
    // Convertendo string em objeto
    let dados = JSON.parse(this.responseText);

    // Construindo HTMLstring
    let htmlString = "";

    // Adicionando filmes
    console.log(`dados.results = ${dados.results}`);
    console.log(`dados.results.length = ${dados.results.length}`);
    if (dados.results != null) {
      dados.results.forEach(
        (value, index) => {
          if (index == 0) {
            htmlString += `<div class="carousel-item active">\n`; // div1: Inicio
          } else {
            htmlString += `<div class="carousel-item">\n`; // div1: Inicio
          }
          htmlString += '<div class="row">\n'; // div2: Inicio
          htmlString += '<div class="col-6">\n'; // div3: Inicio
          htmlString += `<h2>${value.title}</h2>\n`;
          htmlString += `<p>${value.overview}</p>\n`;
          htmlString += "</div>\n"; // div3: Fim
          htmlString += '<div class="col-6">\n'; // div4: Inicio

          if (value.video) {}
          else {
            htmlString +=
              `<img class="movie-poster" src="https://image.tmdb.org/t/p/original/${value.poster_path}">\n`;
          }
          htmlString += "</div>\n"; // div4: Fim
          htmlString += "</div>\n"; // div2: Fim
          htmlString += "</div>\n"; // div1: Fim
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

// Executando as funções de construção de página.
onload = function () {
  construirFilmesLancamentos();
};
