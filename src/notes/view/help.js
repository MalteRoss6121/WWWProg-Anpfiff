/**
 * Escape reserved characters for HTML output.
 * @see https://stackoverflow.com/a/4835406
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text != undefined ? text.toString().replace(/[&<>"']/g, function (m) {
    return map[m];
  }) : "";
}
