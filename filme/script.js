import { API_KEY, LANGUAGE } from "../JavaScript/constantes.js";
import { construirPaginaErroXmlHttpRequest } from "../JavaScript/construir-pagina-erro-xml-http-request.js";
import { ConverterUrlImagemTheMovieDb } from "../JavaScript/converter-url-imagem-the-movie-db.js";

/**
 * Armazena os dados do filme.
 */
let dadosFilme;

/**
 * Obtém do navegador do usuário o valor do parâmetro 'id'.
 * @returns Valor do parâmetro 'id'.
 */
function ObterQueryStringId() {
  let url = new URL(window.location.href);
  return url.searchParams.get("id");
}

/**
 * Obtendo do 'The Movie DB' os dados do filme.
 * @param {String} id ID do filme.
 */
function ObterDadosDoFilme(id) {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/movie/${id}/?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosFilme = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Constrói a página com os dados do filme.
 */
function construirPaginaComDadosDoFilme() {
  let htmlString = "";
}

onload = () => {
  // Obtendo a queryString 'id' da página atual
  let id = ObterQueryStringId();

  // Obtendo os dados do filme
  ObterDadosDoFilme(id);

  // Construindo a página com os dados do filme
};
