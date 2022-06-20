/**
 * Converte código de um idioma em ISO 639-1 para Português Brasil.
 * @param {String} codigo Código ISO 639-1.
 * @returns Valor em Português do código.
 */
export function converterCodigoLinguaIso6391ParaPortuguesBrasil(codigo) {
  let nomeLinguasEmPortugues = new Intl.DisplayNames(["pt-BR"], {
    type: "language",
  });

  return nomeLinguasEmPortugues.of(codigo);
}

/**
 * Converte código de um país em ISO 639-1 para Português Brasil.
 * @param {String} codigo Código ISO 639-1.
 * @returns Valor em Português do código.
 */
export function converterCodigoPaisIso6391ParaPortuguesBrasil(codigo) {
  let nomeLinguasEmPortugues = new Intl.DisplayNames(["pt-BR"], {
    type: "region",
  });

  return nomeLinguasEmPortugues.of(codigo);
}
