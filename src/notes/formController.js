// formController.js


export const handleForm = async (ctx, formData, formErrors, nunjucks) => {
  const body = nunjucks.render('form.html', {formData,formErrors});
  return createResponse(ctx, body, 400, "text/html");
};

export const handleFormContact = async (ctx, formData, formErrors, nunjucks) => {
  const body = nunjucks.render('about.html', {formData,formErrors});
  return createResponse(ctx, body, 400, "text/html");
};

export const handleLoginForm = async (ctx, formData, formErrors, nunjucks) => {
  const html = nunjucks.render("login.html", {
    formData: Object.fromEntries(formData),
    formErrors: formErrors,
  });

  ctx.response.body = html;
  ctx.response.status = 200;
  ctx.response.headers.set("Content-Type", "text/html");
  return ctx;
};

// Hilfsfunktionen
export const processFormData = (formData) => {
  const date = formData.get("date");
  const title = formData.get("title");
  const text = formData.get("text");
  const zeit = formData.get("uhrzeit");
  const tag = formData.get("tag");
  const bild = formData.get("bildurl");

  const formErrors = {};
  if (!isValidDate(date)) {
    formErrors.date = "Invalid date";
  }
  if (!isValidText(title)) {
    formErrors.title = "Titel muss mind. 3 character lang sein!";
  }
  if (!isValidText(text)) {
    formErrors.text = "Text muss mind. 3 character lang sein!";
  }

  return { date, title, text, zeit, tag, bild, formErrors };
};

export const processRegisterFormData = (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const username = formData.get("username");

  const formErrors = {};

  if (!email || !email.includes("@")) {
    formErrors.email = "ungültige email";
  }

  if (!password || password.length < 1) {
    formErrors.password = "Passwort muss min 8 Buchstaben haben";
  }

  if (!username) {
    formErrors.username = "Nutzername kann nicht leer sein";
  }

  return { email, password, username, formErrors };
};

export const processLoginFormData = (formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const formErrors = {};

  if (!email || !email.includes("@")) {
    formErrors.email = "ungültige email";
  }

  if (!password) {
    formErrors.password = "Passwort kann nicht leer sein";
  }

  return { email, password, formErrors };
};

export const processProfileFormData = (formData) => {
  const email = formData.get("email");
  const name = formData.get("username");
  const events = formData.get("events");

  const formErrors = {};

  if (!email || !email.includes("@")) {
    formErrors.email = "ungültige email";
  }

  if (!name) {
    formErrors.name = "Passwort kann nicht leer sein";
  }

  return { email, name, events, formErrors };
};

export const processContactFormData = (formData) => {
  const vorname = formData.get("vorname");
  const nachname = formData.get("nachname");
  const titel = formData.get("titel");
  const text = formData.get("text");

  const formErrors = {};

  return { vorname, nachname, titel, text, formErrors };
};

// Helper functions
const createResponse = (ctx, body, status, header) => {
  ctx.response.body = body;
  ctx.response.headers.set("content-type", header);
  ctx.response.status = status;
  return ctx;
};


export const isValidDate = (date) => {
  const test = new Date(date);
  return test != "Invalid Date" && date.length >= 4;
};

export const isValidText = (text) => text.length >= 3;

