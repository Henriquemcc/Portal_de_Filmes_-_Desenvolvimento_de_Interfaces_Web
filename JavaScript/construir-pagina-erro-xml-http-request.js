/**
 * Constrói página de erro para erros de XmlHttpRequest.
 * @param {XMLHttpRequest} xmlHttpRequestObject
 * @param {Number} status Código de estado HTTP.
 * @param {String} statusText Mensagem de estado do servidor HTTP.
 * @param {String} responseText Texto de resposta do servidor HTTP.
 */
export function construirPaginaErroXmlHttpRequest({xmlHttpRequestObject, status, statusText, responseText} = {}) {

  // Obtendo parâmetros do xmlHttpRequestObject
  if (xmlHttpRequestObject != null) {
    if (status == null) {
      status = xmlHttpRequestObject.status;
    }

    if (statusText == null) {
      statusText = xmlHttpRequestObject.statusText;
    }

    if (responseText == null) {
      responseText = xmlHttpRequestObject.responseText;
    }
  }

  let htmlString = "";
  htmlString += "<main>";
  htmlString += '<div style="text-align: center;">';
  htmlString += "<h1>Erro ao construir página HTML</h1>";
  htmlString += "<h2>Erro ao realizar 'XMLHttpRequest'</h2>";
  htmlString += `<p style="color: red;">Status: ${status}</p>`;
  htmlString += `<p style="color: red;">Status Text:${statusText}</p>`;
  htmlString += `<p style="color: red;">Response Text:${responseText}</p>`;
  htmlString += "</div>";
  htmlString += "</main>";

  document.body.innerHTML = htmlString;
}

/**
 * Constrói página de erro para erros de XmlHttpRequest de forma assíncrona.
 */
export function construirPaginaErroXmlHttpRequestAsync() {

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