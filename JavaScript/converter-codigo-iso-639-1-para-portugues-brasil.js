/**
 * Converte cógido em ISO 639-1 para Português Brasil.
 * @param {String} codigo Código ISO 639-1.
 * @returns Valor em Português do código.
 */
export function converterCodigoIso6391ParaPortuguesBrasil(codigo) {
  let nomeLinguasEmPortugues = new Intl.DisplayNames(["pt-BR"], {
    type: "language",
  });

  return nomeLinguasEmPortugues.of(codigo);
}
