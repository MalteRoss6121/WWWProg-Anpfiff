/*** DO NOT USE IN PRODUCTION. */
/**
 *
 * Dies Form des Templating dient nur Studienzwecken.
 * Nicht in Produktivsystem nutzen!
 * In Produktivsystemen ist ein Template-Engine mit
 * Autoescaping unbedingt nötig.
 *
 */

import { escapeHtml as e } from "./view/help.js"

/**
 * Renders the about page as HTML.
 * @returns {string}
 */
export const renderAbout = async () => layout(`<h1>Laboraufgabe Formular</h1>`);

/**
 * Renders the error 404 page as HTML.
 * @returns {string}
 */
export const renderError404 = async () => layout(`<h1>404</h1>`)

/**
 * Renders one note as HTML.
 * @param {Record<string, any>} note
 * @returns {string}
 */
const renderNote = (note) => `
  <li><h2>${e(note.title)}</h2>
  <p>${e(note.date)}</p>
  <div>${e(note.text)}</div>
  <p><a href="/edit/${e(note.id)}">Bearbeiten</a></p></li>`

/**
* Renders all notes as HTML.
* @param {Array[Record<string, any>]} data
* @returns {string}
*/
export const renderIndex = async (data) => layout(`
<ul>
${data.map(renderNote).join("\n")}
</ul>
`)

/**
 * Renders one form error as HTML.
 * @param {string} error
 * @returns {string}
 */
const showError = (error) => error ? `<p class="Form-error">${e(error)}</p>` : ``

/**
 * Renders the form for adding and editing a note as HTML.
 * @param {Array[Record<string, any>]} formData
 * @param {Array[Record<string, any>]} formErrors
 * @returns {string}
 */
export const renderForm = async (formData, formErrors) => layout(
  `<form action="#" method="POST">
  <label for="date">Datum</label>
  <div>
      ${showError(formErrors.date)}
      <input type="datetime-local" id="date" name="date" value="${e(formData.date)}">
  </div>
  <label for="title">Titel</label>
  <div>
      ${showError(formErrors.title)}
      <input type="text" id="title" name="title" autofocus value="${e(formData.title)}">
  </div>
  <label for="text">Text</label>
  <div>
      ${showError(formErrors.text)}
      <textarea id="text" name="text" rows="8" cols="20">${e(formData.text)}</textarea>
  </div>
  <button type="submit">Speichern</button>

</form>
`)


/**
 * Wraps the HTML content with a complete HTML document.
 * @param {string} content
 * @returns {string}
 */
const layout = (content) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <title>Anpfiff Flensburg</title>
    <style>
    @media screen and (min-width: 0em) {

      /** CSS for mobile */
    
      /*##########################################################*/
      /* HOME SEITE */
      /*##########################################################*/
    
      @font-face {
        font-family: 'Montserrat ExtraLight';
        src: url('fonts/Montserrat-ExtraLight.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat Thin';
        src: url('fonts/montserrat-thin.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat Regular';
        src: url('fonts/montserrat-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat Medium';
        src: url('fonts/montserrat-medium.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat Bold';
        src: url('fonts/montserrat-bold.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat Black';
        src: url('fonts/Montserrat-Black.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      @font-face {
        font-family: 'Montserrat ExtraBold';
        src: url('fonts/Montserrat-ExtraBold.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        list-style: none;
      }
    
      .bar {
        display: block;
        width: 25px;
        height: 3px;
        margin: 5px auto;
        background-color: #000000;
      }
    
      .hamburger {
        display: block;
        float: right;
      }
    
      li {
        list-style: none;
      }
    
      a {
        color: #000000;
        text-decoration: none;
      }
    
      .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        gap: 0;
        flex-direction: column;
        width: 100%;
        text-align: center;
        background-color: #3d3d3d;
        transition: 0.3;
      }
    
      .navbar {
        min-height: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
      }
    
      .nav-item {
        margin: 16px 0;
      }
    
      .nav-menu li {
        margin-top: 10%;
        margin-bottom: 10%;
        list-style: none;
      }
    
      .nav-menu.active {
        left: 0;
      }
    
      body .nav-menu.active {
        display: hidden;
      }
    
      .nav-name {
        font-size: 2rem;
      }
    
      /*##########################################################*/
      /* CSS FOR INDEX.PHP */
      /*##########################################################*/
    
      body {
        font-family: 'Montserrat Medium', sans-serif;
      }
    
      .firstContent {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        font-family: 'Lucida Sans';
        font-weight: bolder;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: 2%;
        font-size: 30%;
      }
    
      .firstContainer {
        /* box-shadow: 0px 10px 10px white inset; */
        position: relative;
        color: #007704;
        background-image: url('anpfiffStart.png');
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
      }
    
      .firstContainer::before {
        content: '';
        display: block;
        padding-top: 50%;
    
      }
    
      .firstContent h1 {
        font-size: 400%;
      }
    
      .btn-event {
        width: min-content;
        padding: 10px;
        padding-left: 40px;
        padding-right: 40px;
        border-radius: 25px;
        background-color: whitesmoke;
        font-size: 2rem;
        border: none;
        transition: 0.5s ease;
      }
    
      .btn-event:hover {
        background-color: blueviolet;
        cursor: pointer;
      }
    
      .eventsHead {
        padding: 20px;
        background-color: #696969;
        text-align: center;
        color: #fefefe;
        font-family: Verdana;
        font-weight: bolder;
        box-shadow: 0px 5px 5px rgb(50, 50, 50) inset;
      }
    
      .eventContainer {
        padding: 20px;
        background-color: #696969;
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        min-height: 420px;
        box-shadow: 0px 5px 5px rgb(50, 50, 50) inset;
      }
    
      .event {
        flex: 0 0 auto;
        margin-right: 20px;
        float: left;
        text-align: center;
        color: #ffffff;
        font-family: 'Lucida Sans';
        font-weight: bolder;
        font-size: 1.5rem;
      }
    
    
      .imgPlc {
        height: 300px;
        width: 230px;
        background-color: #FFFFFF;
        border-radius: 30px;
        transition: 0.7s ease;
      }
    
      .imgPlc:hover {
        margin-top: 10px;
      }
    
      .info {
        margin-top: 5%;
        font-family: 'Montserrat Regular';
      }
    
      .infoelement h2:first-of-type {
        font-family: 'Montserrat Black';
        font-size: 25px;
        color: green;
      }
    
      .infoelement:first-of-type h2 {
        font-size: 32px;
      }
    
      .infoelement {
        text-align: center;
      }
    
      .infoelement h2:nth-child(2n +1) {
        text-align: center;
      }
    
      .infoelement p:nth-child(2n) {
        margin-left: 10%;
        margin-right: 10%;
        margin-bottom: 88px;
        font-size: 20px;
      }
    
    
      .infoimg {
        background-color: antiquewhite;
        padding-top: 40%;
        padding-bottom: 40%;
        margin-left: 20%;
        margin-right: 20%;
      }
    
      .infoimg2 {
        background-color: antiquewhite;
        padding-top: 40%;
        padding-bottom: 40%;
        margin-top: 10%;
        margin-left: 20%;
        margin-right: 20%;
      }
    
    
      .Contact {
        background-color: #343434;
        width: 100%;
        text-align: center;
      }
    
      .Contact h1 {
        padding-top: 5%;
        font-family: 'Montserrat ExtraBold';
        color: #4BDF0D;
      }
    
      .Contact h2 {
        color: #4BDF0D;
      }
    
      .Contact p {
        color: white;
        margin: 2%;
      }
    
      .Contact ul {
        list-style-type: none;
        margin: 0;
        margin-top: 8%;
        padding: 0;
      }
    
      .Contact li {
        margin: 0;
        padding: 0;
        color: white;
        margin-top: 1%;
        margin-bottom: 1%;
      }
    
    }
    
    @media screen and (min-width: 40em) {
    
      /** CSS for Desktop */
    
      /*##########################################################*/
      /* HEADER */
      /*##########################################################*/
    
      li {
        margin-top: 0;
        margin-bottom: 0;
      }
    
      .nav-menu {
        position: relative;
        left: 0;
        top: 4%;
        width: 50%;
        flex-direction: row;
        background-color: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 60px;
      }
    
      .nav-menu li {
        margin: 0;
        list-style: none;
      }
    
      .nav-item {
        justify-content: space-between;
        margin: 240;
      }
    
      .nav-name {
        position: absolute;
        top: 0;
        left: 0;
        width: 5rem;
      }
    
      .nav-link {
        transition: 0.7s ease;
      }
    
      .nav-link:hover {
        color: #343434;
      }
    
      .hamburger {
        display: none;
        cursor: pointer;
      }
    
      /*##########################################################*/
      /* CSS FOR INDEX.PHP */
      /*##########################################################*/
    
      .firstContainer {
        /* box-shadow: 0px 10px 10px white inset; */
        position: relative;
        color: #007704;
        background-image: url('fb.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
      }
    
      .firstContainer::before {
        content: '';
        display: block;
        padding-top: 50%;
    
      }
    
      .firstContent {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        font-family: 'Lucida Sans';
        font-weight: bolder;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: 2%;
        font-size: 100%;
      }
    
      .firstContent h1 {
        font-size: 400%;
      }
    
      .btn-event {
        width: min-content;
        padding: 10px;
        padding-left: 40px;
        padding-right: 40px;
        border-radius: 25px;
        background-color: whitesmoke;
        font-size: 2rem;
        border: none;
        transition: 0.5s ease;
      }
    
      .btn-event:hover {
        background-color: blueviolet;
        cursor: pointer;
      }
    
      .eventsHead {
        padding: 20px;
        background-color: #696969;
        text-align: center;
        color: #fefefe;
        font-family: Verdana;
        font-weight: bolder;
        box-shadow: 0px 5px 5px rgb(50, 50, 50) inset;
      }
    
      .eventContainer {
        padding: 20px;
        background-color: #696969;
        overflow-x: scroll;
        display: flex;
        flex-direction: row;
        min-height: 420px;
        box-shadow: 0px 5px 5px rgb(50, 50, 50) inset;
      }
    
      .event {
        flex: 0 0 auto;
        margin-right: 20px;
        float: left;
        text-align: center;
        color: #ffffff;
        font-family: 'Lucida Sans';
        font-weight: bolder;
        font-size: 1.5rem;
      }
    
    
      .imgPlc {
        height: 300px;
        width: 230px;
        background-color: #FFFFFF;
        border-radius: 30px;
        transition: 0.7s ease;
      }
    
      .imgPlc:hover {
        margin-top: 10px;
      }
    
      .info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
      }
    
      .infoelement {
        text-align: center;
        grid-column: 1/3;
      }
    
      .infoimg,
      .infoimg2 {
        background-color: antiquewhite;
        padding-top: 40%;
        padding-bottom: 40%;
        margin: 10px;
      }
    
      .header {
        box-shadow: 0px -4px 4px rgb(92, 92, 92) inset;
      }
    
    
    }
    </style>
</head>


<body>
    
    <div class="firstContainer">
        <div class="firstContent">
            <span>
            </span>
            <a href="#events">
                <div class="btn-event">EVENTS</div>
            </a>
        </div>

    </div>


    <div class="eventsHead">
        <h1 id="events">EVENTS</h1>
    </div>
    <div class="eventContainer">

    ${content}

    </div>
    <div class="info">
        <div class="infoelement">
            <h2>Was machen wir?</h2>
            <p> In unserer Sportbar dreht sich alles um die perfekte Mischung aus Sport, Geselligkeit und Unterhaltung. Wir sind der ultimative Treffpunkt für Sportbegeisterte und Fans der sportlichen Atmosphäre.</p>
        </div>
        <div class="infoelement">
            <h2>Wo sind wir?</h2>
            <p> Unsere Sportbar befindet sich in Flensburg, DA WO BRANDON WOHNT, leicht erreichbar und perfekt für spontane Treffen oder geplante Abende. Schauen Sie vorbei und erleben Sie die Begeisterung in unserer gemütlichen Atmosphäre.</p>
        </div>
        <div class="infoelement">
            <h2>Wer sind wir?</h2>
            <p> Wir sind ein leidenschaftliches Team von Sportenthusiasten und Gastgebern. Unser Ziel ist es, Ihnen unvergessliche Erlebnisse zu bieten, sei es beim Anfeuern Ihrer Lieblingsmannschaften oder beim Genießen unserer breiten Auswahl an Getränken.</p>
        </div>
        <div class="infoelement">
            <h2>Was uns aus macht.</h2>
            <p> Unsere Leidenschaft für den Sport, unsere herzliche Gastfreundschaft und unser breites Angebot an Getränken. Wir laden Sie ein, Teil einer einzigartigen Atmosphäre zu werden, in der Sport und Geselligkeit Hand in Hand gehen.</p>
        </div>

        <div class="infoimg">
            <img src="">
        </div>
        <div class="infoimg2">
            <img src="">
        </div>
    </div>
    <div class="Contact">
        <h1>BESUCHT UNS GERNE! </h1>
        <h2>Kontaktiere Uns</h2>
        <p>
            Wir freuen uns, von Ihnen zu hören! Wenn Sie Fragen, Anmerkungen oder Anfragen haben,
            zögern Sie nicht, uns über E-mail oder übers Telefon zu erreichen. Wir sind bestrebt, Ihnen so
            schnell wie möglich zu antworten.
        </p>
        <ul>
            <li>Telefon: </li>
            <li>E-Mail: </li>
            <li>Kp was noch</li>
        </ul>
    </div>

</body>

</html>`

/*** DO NOT USE IN PRODUCTION. */
