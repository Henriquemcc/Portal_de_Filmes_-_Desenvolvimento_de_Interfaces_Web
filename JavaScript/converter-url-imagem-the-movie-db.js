import { stringIsValidHttpUrl } from "./string-is-valid-http-url.js";

/**
 * Converte a URL de uma imagem do 'The Movie DB' para uma URL válida.
 * @param {String} url Url a ser convertida para uma url válida.
 * @returns Url válida para a imagem ou null.
 */
export function converterUrlImagemTheMovieDb(url) {
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
