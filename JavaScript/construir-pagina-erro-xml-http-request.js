/**
 * Constrói página de erro para erros de XmlHttpRequest.
 */
export function construirPaginaErroXmlHttpRequest() {
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
