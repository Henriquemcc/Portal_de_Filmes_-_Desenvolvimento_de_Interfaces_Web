const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

/**
 * Armazena os dados obtidos pela pesquisa.
 */
let dadosObtidosPelaPesquisa = new Array();

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

onload = () => {
  // Obtendo a queryString 'search' da página atual
  let pesquisa = ObterQueryStringPesquisa();

  // Adicionando a queryString 'search' á barra de pesquisa
  document.querySelector("#search-bar").value = pesquisa;

  // Obtendo os dados da pesquisa
  ObterDadosDaPesquisa(pesquisa);
};
