const API_KEY = "2d2acb82a666c20e59e8df89dfb3ce28";
const LANGUAGE = "pt-BR";

/**
 * Armazena os dados obtidos pela pesquisa.
 */
let dadosObtidosPelaPesquisa;
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

/**
 * Verifica se uma string é uma URL http válida.
 * @param {String} str String a ser verificada.
 * @return Valor booleano indicando se a String passada é uma URL http válida.
 */
function stringIsValidHttpUrl(str) {
  try {
    let url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Converte a URL de uma imagem do 'The Movie DB' para uma URL válida.
 * @param {String} url Url a ser convertida para uma url válida.
 * @returns Url válida para a imagem ou null.
 */
function ConverterUrlImagemTheMovieDb(url) {
  if (url != null) {
    // Removendo '\'
    if (url.startsWith("\\")) {
      url = url.substring(1);
    }

    // Removendo '/'
    if (url.startsWith("/")) {
      url = url.substring(1);
    }

    // Adicionando 'https://image.tmdb.org/t/p/original/' a url
    if ((!url.startsWith("http://")) && (!url.startsWith("https://"))) {
      url = `https://image.tmdb.org/t/p/original/${url}`;
    }

    if (!stringIsValidHttpUrl(url)) {
      url = null;
    }
  }

  return url;
}

function ConstruirPaginaComDadosDaPesquisa() {
  let htmlString = "";

  dadosObtidosPelaPesquisa.results.forEach(
    (resultadoPesquisa) => {
      htmlString += '<div class="box-resultado">';

      // Exibindo a imagem
      let urlImagem = ConverterUrlImagemTheMovieDb(
        resultadoPesquisa.poster_path,
      );
      if (urlImagem != null) {
        htmlString +=
          `<img src="${urlImagem}" alt="${resultadoPesquisa.title}">`;
      }

      // Exibindo o tipo de conteúdo
      let tipoConteudo;
      switch (resultadoPesquisa.media_type) {
        case "movie":
          tipoConteudo = "Filme";
          break;
        case "tv":
          tipoConteudo = "Programa de TV";
          break;
        default:
          tipoConteudo = "";
      }
      htmlString += `<span class="tipo-conteudo">${tipoConteudo}</span><br>`;

      // Exibindo o titulo
      htmlString +=
        `<span class="titulo-original">${resultadoPesquisa.original_title}</span><br>`;

      // Exibindo o
      htmlString +=
        `<span class="titulo">${resultadoPesquisa.title}</span><br>`;
      htmlString +=
        `<span class="descricao">${resultadoPesquisa.overview}</span><br>`;
      htmlString += "</div>";
    },
  );

  document.querySelector("main").innerHTML = htmlString;
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
