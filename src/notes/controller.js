// controller.js

import * as model from "./model.js";
import { handleForm } from './formController.js';

export const handleIndex = async (ctx, db, nunjucks) => {
  const body = nunjucks.render('index.html', {notes: await model.index(db)});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleEvents = async (ctx, db, nunjucks, url) => {
  const tag = url.searchParams.get("tag"); 
  const title = url.searchParams.get("title"); 
  //console.log('Retrieved note from the database:', tag);

  let filteredNotes;
  if (tag && tag !== 'alle') {
    filteredNotes = await model.getEventsByTag(db, tag);
  } else if(title) {
    filteredNotes = await model.getEventsByTitle(db, title);
  } else{
    filteredNotes = await model.index(db);
  }

  const body = nunjucks.render('events.html', { notes: filteredNotes });
  return createResponse(ctx, body, 200, "text/html");
};
export const handleAbout = async (ctx, nunjucks) => {
  const body = nunjucks.render('about.html', {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAddGet = async (ctx, nunjucks) => {
  const body = nunjucks.render('form.html', {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAddPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { date, title, text, zeit, tag, bild, formErrors } = processFormData(formData);

  if (Object.keys(formErrors).length > 0) {
    return handleForm(ctx, formData, formErrors, nunjucks);
  }

  model.add(db, { date, title, text, zeit, tag, bild });
  ctx.response = createRedirectResponse('http://localhost:8080/', 303);
  return ctx;
};

export const handleEdit = async (ctx, db, request, nunjucks) => {
  const url = ctx.Url;
  const noteId = parseInt(url.pathname.split("/")[2], 10);
  const note = await model.getById(db, noteId);
  //console.log('Retrieved note from the database:', note);

  if (request.method === 'GET') {
    const body = nunjucks.render('form.html', {formData: note});
    //console.log('Rendered body:', body);
    return createResponse(ctx, body, 200, "text/html");
  }

  if (request.method === 'POST') {
    const formData = await request.formData();
    const { date, title, text, zeit, tag, bild, formErrors } = processFormData(formData);

    if (Object.keys(formErrors).length > 0) {
      return handleForm(ctx, formData, formErrors, nunjucks);
    }

    await model.update(db, { date, title, text, zeit, tag, bild }, noteId);
    ctx.response = createRedirectResponse('http://localhost:8080/', 303);
    return ctx;
  }
};
const processRegisterFormData = (formData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  const formErrors = {};

  return { email, password, formErrors };
};

export const handleLoginGet = async (ctx, nunjucks) => {
  const body = nunjucks.render('login.html', {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleLoginPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { email, password, formErrors } = processRegisterFormData(formData);
 
  if (Object.keys(formErrors).length > 0) {
   // Handle form errors (render the login form with error messages)
   return handleLoginForm(ctx, formData, formErrors, nunjucks);
  }
 
  // Authenticate user
  const isUserAuthenticated = await model.authenticateUser(db, email, password);
 
  if (isUserAuthenticated) {
   ctx.response = createRedirectResponse('http://localhost:8080/', 303);
   return ctx;
  } else {
   formErrors.login = 'Invalid email or password';
   return handleLoginForm(ctx, formData, formErrors, nunjucks);
  }
 };

export const handleRegisterGet = async (ctx, nunjucks) => {
  const body = nunjucks.render('register.html', {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleRegisterPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { email, password, formErrors } = processRegisterFormData(formData);

  if (Object.keys(formErrors).length > 0) {
    return handleRegisterGet(ctx, nunjucks, formErrors);
  }

  // Register user
  const registrationResult = await model.registerUser(db, email, password);

  if (!registrationResult) {
    console.error('!! User registration failed !!');
    return ctx;
  }

  console.log('!! User registration successful !!');

  ctx.response = createRedirectResponse('http://localhost:8080/login', 303);
  return ctx;
};

const handleLoginForm = async (ctx, formData, formErrors, nunjucks) => {
  const html = nunjucks.render('login.html', {
    formData: Object.fromEntries(formData),
    formErrors: formErrors
  });
 
  ctx.response.body = html;
 };

// Hilfsfunktionen
const processFormData = (formData) => {
  
  const date = formData.get('date');
  const title = formData.get('title');
  const text = formData.get('text');
  const zeit = formData.get('uhrzeit');
  const tag = formData.get('tag');
  const bild = formData.get('bildurl');

  const formErrors = {};
  if (!isValidDate(date)) {
    formErrors.date = 'Invalid date';
  }
  if (!isValidText(title)) {
    formErrors.title = 'Titel muss mind. 3 character lang sein!';
  }
  if (!isValidText(text)) {
    formErrors.text = 'Text muss mind. 3 character lang sein!';
  }


  return { date, title, text, zeit, tag, bild, formErrors };
};

const createResponse = (ctx, body, status, header) => {
  ctx.response.body = body;
  ctx.response.headers.set("content-type", header);
  ctx.response.status = status;
  return ctx;
};

const createRedirectResponse = (url, status) => {
  return Response.redirect(url, status);
};


export const isValidDate = (date) => {
    const test = new Date(date);
    return test != "Invalid Date" && date.length >= 4;
};

export const isValidText = (text) => text.length >= 3;
