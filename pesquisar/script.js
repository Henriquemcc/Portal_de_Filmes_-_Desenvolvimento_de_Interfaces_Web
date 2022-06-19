import { API_KEY, LANGUAGE } from "../JavaScript/constantes.js";
import { construirPaginaErroXmlHttpRequest } from "../JavaScript/construir-pagina-erro-xml-http-request.js";
import { ConverterUrlImagemTheMovieDb } from "../JavaScript/converter-url-imagem-the-movie-db.js";

/**
 * Armazena os dados obtidos pela pesquisa.
 */
let dadosObtidosPelaPesquisa;

/**
 * Obtém do 'The Movie DB' os dados encontrados com a(s) palavra(s) pesquisada(s).
 * @param {String} query Palavra(s) pesquisada(s).
 */
function ObterDadosDaPesquisa(query) {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${LANGUAGE}&query=${query}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosObtidosPelaPesquisa = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Obtém do navegador do usuário o valor do parâmetro 'search'.
 * @returns Valor do parâmetro 'search'.
 */
function ObterQueryStringPesquisa() {
  let url = new URL(window.location.href);
  return url.searchParams.get("search");
}

function ConstruirPaginaComDadosDaPesquisa() {
  let htmlString = "";

  dadosObtidosPelaPesquisa.results.forEach(
    (resultadoPesquisa) => {
      htmlString += '<div class="row">';
      htmlString += '<div class="box-resultado">';

      let tipoConteudo;
      let titulo;
      let tituloOriginal;
      let descricao;
      switch (resultadoPesquisa.media_type) {
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
      let urlImagem = ConverterUrlImagemTheMovieDb(
        resultadoPesquisa.poster_path,
      );
      if (urlImagem != null) {
        htmlString += `<img src="${urlImagem}" alt="${titulo}">`;
      }

      // Exibindo o tipo de conteúdo
      htmlString += `<span class="tipo-conteudo">${tipoConteudo}</span><br>`;

      // Exibindo o titulo
      htmlString +=
        `<span class="titulo-original">${tituloOriginal}</span><br>`;

      // Exibindo o
      htmlString += `<span class="titulo">${titulo}</span><br>`;
      htmlString += `<span class="descricao">${descricao}</span><br>`;
      htmlString += "</div>";
      htmlString += "</div>";
    },
  );

  document.querySelector("#section_resultado_pesquisa").innerHTML = htmlString;
}

onload = () => {
  // Obtendo a queryString 'search' da página atual
  let pesquisa = ObterQueryStringPesquisa();

  // Adicionando a queryString 'search' á barra de pesquisa
  document.querySelector("#search-bar").value = pesquisa;

  // Obtendo os dados da pesquisa
  ObterDadosDaPesquisa(pesquisa);

  // Construindo a página
  ConstruirPaginaComDadosDaPesquisa();
};
