import { API_KEY, LANGUAGE } from "../JavaScript/constantes.js";
import { construirPaginaErroXmlHttpRequest } from "../JavaScript/construir-pagina-erro-xml-http-request.js";
import { converterUrlImagemTheMovieDb } from "../JavaScript/converter-url-imagem-the-movie-db.js";
import { converterNumeroParaStringEmPortuguesBrasil } from "../JavaScript/converter-numero-para-string-portugues-brasil.js";
import {
  converterCodigoLinguaIso6391ParaPortuguesBrasil,
  converterCodigoPaisIso6391ParaPortuguesBrasil,
} from "../JavaScript/converter-codigo-iso-639-1-para-portugues-brasil.js";
import { capitalizeString } from "../JavaScript/capitalize-string.js";

/**
 * Armazena os dados do filme.
 */
let dadosDoFilme;

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
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosDoFilme = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Constrói a página com os dados do filme.
 */
function construirPaginaComDadosDoFilme() {
  let htmlString = "";

  htmlString += '<div class="row">';

  // Título

  if (dadosDoFilme.title != null) {
    htmlString += `<h1 class="titulo">${dadosDoFilme.title}</h1>`;
  }

  // Imagem
  let urlImagem = converterUrlImagemTheMovieDb(dadosDoFilme.poster_path);
  if (urlImagem != null) {
    htmlString += `<img src="${urlImagem}" alt="${dadosDoFilme.title}">`;
  }

  // Título Original
  if (dadosDoFilme.original_title != null) {
    htmlString +=
      `<span class="titulo-original">Título Original: ${dadosDoFilme.original_title}.</span><br>`;
  }

  // Adulto
  if (dadosDoFilme.adult != null) {
    let adultoStr;
    if (dadosDoFilme.adult) {
      adultoStr = "Sim";
    } else {
      adultoStr = "Não";
    }
    htmlString += `<span class="adulto">Adulto: ${adultoStr}.</span>`;
  }

  // Descrição
  if (dadosDoFilme.overview != null) {
    htmlString += `<span class="descricao">${dadosDoFilme.overview}</span><br>`;
  }

  // Orçamento
  if (dadosDoFilme.budget != null) {
    let orcamentoStr = converterNumeroParaStringEmPortuguesBrasil(
      dadosDoFilme.budget,
    );
    htmlString +=
      `<span class="orcamento">Orçamento: $${orcamentoStr}.</span><br>`;
  }

  // Receita
  if (dadosDoFilme.revenue != null) {
    let receitaStr = converterNumeroParaStringEmPortuguesBrasil(
      dadosDoFilme.revenue,
    );
    htmlString += `<span class="receita">Receita: $${receitaStr}.</span><br>`;
  }

  // Língua original
  if (dadosDoFilme.original_language != null) {
    let linguaOriginal = capitalizeString(
      converterCodigoLinguaIso6391ParaPortuguesBrasil(
        dadosDoFilme.original_language,
      ),
    );

    htmlString +=
      `<span class="lingua-original">Língua Original: ${linguaOriginal}.</span><br>`;
  }

  // Línguas faladas
  if (dadosDoFilme.spoken_languages != null) {
    let linguasFaladasArray = new Array();
    dadosDoFilme.spoken_languages.forEach(
      (spoken_language) => {
        linguasFaladasArray.push(
          capitalizeString(
            converterCodigoLinguaIso6391ParaPortuguesBrasil(
              spoken_language.iso_639_1,
            ),
          ),
        );
      },
    );
    let linguasFaladasString = "";
    for (let i = 0; i < linguasFaladasArray.length; i++) {
      linguasFaladasString += linguasFaladasArray[i];
      if (i == linguasFaladasArray.length - 2) {
        linguasFaladasString += " e ";
      } else if (i < linguasFaladasArray.length - 1) {
        linguasFaladasString += ", ";
      }
    }
    htmlString +=
      `<span class="liguas-faladas">Lígua(s) Falada(s): ${linguasFaladasString}.</span><br>`;
  }

  // Populariade
  if (dadosDoFilme.popularity != null) {
    let popularidade = converterNumeroParaStringEmPortuguesBrasil(
      dadosDoFilme.popularity,
    );
    htmlString +=
      `<span class="popularidade">Popularidade: ${popularidade}.</span><br>`;
  }

  // Empresas produtoras
  if (dadosDoFilme.production_companies != null) {
    let empresasProdutorasArray = new Array();

    dadosDoFilme.production_companies.forEach(
      (production_company) => {
        empresasProdutorasArray.push(production_company.name);
      },
    );

    let empresasProdutorasString = "";
    for (let i = 0; i < empresasProdutorasArray.length; i++) {
      empresasProdutorasString += empresasProdutorasArray[i];
      if (i == empresasProdutorasArray.length - 2) {
        empresasProdutorasString += " e ";
      } else if (i < empresasProdutorasArray.length - 1) {
        empresasProdutorasString += ", ";
      }
    }
    htmlString +=
      `<span class="empresas-producao">Produtora(s): ${empresasProdutorasString}.</span><br>`;
  }

  // País de produção
  if (dadosDoFilme.production_countries != null) {
    let paisProducaoArray = new Array();

    dadosDoFilme.production_countries.forEach(
      (production_country) => {
        paisProducaoArray.push(converterCodigoPaisIso6391ParaPortuguesBrasil(
          production_country.iso_3166_1,
        ));
      },
    );

    let paisProducaoString = "";
    for (let i = 0; i < paisProducaoArray.length; i++) {
      paisProducaoString += paisProducaoArray[i];
      if (i == paisProducaoArray.length - 2) {
        paisProducaoString += " e ";
      } else if (i < paisProducaoArray.length - 1) {
        paisProducaoString += ", ";
      }
    }

    htmlString +=
      `<span class="paises-producao">Paíse(s) de produção: ${paisProducaoString}.</span><br>`;
  }

  htmlString += "</div>";

  document.querySelector("#section_dados_filme").innerHTML = htmlString;
}

onload = () => {
  // Obtendo a queryString 'id' da página atual
  let id = ObterQueryStringId();

  // Obtendo os dados do filme
  ObterDadosDoFilme(id);

  // Construindo a página com os dados do filme
  construirPaginaComDadosDoFilme();
};
