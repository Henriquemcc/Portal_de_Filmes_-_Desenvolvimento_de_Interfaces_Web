import { MOVIE_DB_API_KEY, LANGUAGE } from "../JavaScript/constantes.js";
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
let dadosDoProgramaDeTv;

/**
 * Obtém do navegador do usuário o valor do parâmetro 'id'.
 * @returns Valor do parâmetro 'id'.
 */
function ObterQueryStringId() {
  let url = new URL(window.location.href);
  return url.searchParams.get("id");
}

/**
 * Obtendo do 'The Movie DB' os dados do programa de tv.
 * @param {String} id ID do filme.
 */
function ObterDadosDoProgramaDeTv(id) {
  let xmlHttpRequestObject = new XMLHttpRequest();
  xmlHttpRequestObject.open(
    "GET",
    `https://api.themoviedb.org/3/tv/${id}?api_key=${MOVIE_DB_API_KEY}&language=${LANGUAGE}`,
    false,
  );
  xmlHttpRequestObject.onerror = construirPaginaErroXmlHttpRequest;
  xmlHttpRequestObject.send();
  dadosDoProgramaDeTv = JSON.parse(xmlHttpRequestObject.responseText);
}

/**
 * Constrói a página com os dados do programa de TV.
 */
function construirPaginaComDadosDoProgramaDeTv() {
  let htmlString = "";

  htmlString += '<div class="row">';

  // Título e ano
  if (dadosDoProgramaDeTv.name != null) {
    htmlString +=
      `<h1 class="titulo"><strong>${dadosDoProgramaDeTv.name}</strong> `;

    // Adicionando título á página
    document.querySelector("title").innerText = dadosDoProgramaDeTv.name;

    // Ano
    if (
      dadosDoProgramaDeTv.first_air_date != null &&
      dadosDoProgramaDeTv.last_air_date != null
    ) {
      let dataInicio = new Date(dadosDoProgramaDeTv.first_air_date);
      let dataFim = new Date(dadosDoProgramaDeTv.last_air_date);

      if (dataInicio.getFullYear() === dataFim.getFullYear()) {
        htmlString += `(${dataInicio.getFullYear()})`;
      } else {
        htmlString += `(${dataInicio.getFullYear()}-${dataFim.getFullYear()})`;
      }
    }

    htmlString += "</h1>";
  }

  // Imagem
  let urlImagem = converterUrlImagemTheMovieDb(dadosDoProgramaDeTv.poster_path);
  if (urlImagem != null) {
    htmlString += `<img src="${urlImagem}" alt="${dadosDoProgramaDeTv.title}">`;
  }

  // Nome Original
  if (dadosDoProgramaDeTv.original_name != null) {
    htmlString += '<span class="titulo-original chave">Nome Original:</span>';
    htmlString +=
      `<span class="titulo-original valor">${dadosDoProgramaDeTv.original_name}.</span><br>`;
  }

  // Adulto
  if (dadosDoProgramaDeTv.adult != null) {
    let adultoStr;
    if (dadosDoProgramaDeTv.adult) {
      adultoStr = "Sim";
    } else {
      adultoStr = "Não";
    }
    htmlString += '<span class="adulto chave">Adulto: </span>';
    htmlString += `<span class="adulto valor">${adultoStr}.</span><br>`;
  }

  // Descrição
  if (dadosDoProgramaDeTv.overview != null) {
    htmlString += '<span class="descricao chave">Sinopse: </span>';
    htmlString +=
      `<span class="descricao valor">${dadosDoProgramaDeTv.overview}</span><br>`;
  }

  // Língua original
  if (dadosDoProgramaDeTv.original_language != null) {
    let linguaOriginal = capitalizeString(
      converterCodigoLinguaIso6391ParaPortuguesBrasil(
        dadosDoProgramaDeTv.original_language,
      ),
    );

    htmlString += '<span class="lingua-original chave">Língua Original:</span>';
    htmlString +=
      `<span class="lingua-original valor">${linguaOriginal}.</span><br>`;
  }

  // Línguas faladas
  if (dadosDoProgramaDeTv.spoken_languages != null) {
    let linguasFaladasArray = [];
    dadosDoProgramaDeTv.spoken_languages.forEach(
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
      if (i === linguasFaladasArray.length - 2) {
        linguasFaladasString += " e ";
      } else if (i < linguasFaladasArray.length - 1) {
        linguasFaladasString += ", ";
      }
    }
    htmlString +=
      '<span class="liguas-faladas chave">Lígua(s) Falada(s):</span>';
    htmlString +=
      `<span class="liguas-faladas valor">${linguasFaladasString}.</span><br>`;
  }

  // Populariade
  if (dadosDoProgramaDeTv.popularity != null) {
    let popularidade = converterNumeroParaStringEmPortuguesBrasil(
      dadosDoProgramaDeTv.popularity,
    );
    htmlString += '<span class="popularidade chave">Popularidade:</span>';
    htmlString +=
      `<span class="popularidade valor">${popularidade}.</span><br>`;
  }

  // Empresas produtoras
  if (dadosDoProgramaDeTv.production_companies != null) {
    let empresasProdutorasArray = [];

    dadosDoProgramaDeTv.production_companies.forEach(
      (production_company) => {
        empresasProdutorasArray.push(production_company.name);
      },
    );

    let empresasProdutorasString = "";
    for (let i = 0; i < empresasProdutorasArray.length; i++) {
      empresasProdutorasString += empresasProdutorasArray[i];
      if (i === empresasProdutorasArray.length - 2) {
        empresasProdutorasString += " e ";
      } else if (i < empresasProdutorasArray.length - 1) {
        empresasProdutorasString += ", ";
      }
    }
    htmlString += '<span class="empresas-producao chave">Produtora(s):</span>';
    htmlString +=
      `<span class="empresas-producao valor">${empresasProdutorasString}.</span><br>`;
  }

  // País de produção
  if (dadosDoProgramaDeTv.production_countries != null) {
    let paisProducaoArray = [];

    dadosDoProgramaDeTv.production_countries.forEach(
      (production_country) => {
        paisProducaoArray.push(converterCodigoPaisIso6391ParaPortuguesBrasil(
          production_country.iso_3166_1,
        ));
      },
    );

    let paisProducaoString = "";
    for (let i = 0; i < paisProducaoArray.length; i++) {
      paisProducaoString += paisProducaoArray[i];
      if (i === paisProducaoArray.length - 2) {
        paisProducaoString += " e ";
      } else if (i < paisProducaoArray.length - 1) {
        paisProducaoString += ", ";
      }
    }

    htmlString +=
      '<span class="paises-producao chave">País(es) de produção:</span>';
    htmlString +=
      `<span class="paises-producao">${paisProducaoString}.</span><br>`;
  }

  htmlString += "</div>";

  document.querySelector("#section_dados_programa_de_tv").innerHTML =
    htmlString;
}

onload = () => {
  // Obtendo a queryString 'id' da página atual
  let id = ObterQueryStringId();

  // Obtendo os dados do programa de tv
  ObterDadosDoProgramaDeTv(id);

  // Construindo a página com os dados do de tv
  construirPaginaComDadosDoProgramaDeTv();
};
