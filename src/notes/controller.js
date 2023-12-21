// controller.js

import * as model from "./model.js";
import { handleForm } from './formController.js';

export const handleIndex = async (ctx, db, nunjucks) => {
  const body = nunjucks.render('index.html', {notes: await model.index(db)});
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

  if (request.method === 'GET') {
    const body = nunjucks.render('form.html', {formData: note});
    return createResponse(ctx, body, 200, "text/html");
  }

  if (request.method === 'POST') {
    const formData = await request.formData();
    const { date, title, text, formErrors } = processFormData(formData);

    if (Object.keys(formErrors).length > 0) {
      return handleForm(ctx, formData, formErrors, nunjucks);
    }

    await model.update(db, { date, title, text }, noteId);
    ctx.response = createRedirectResponse('http://localhost:8080/', 303);
    return ctx;
  }
};

// Hilfsfunktionen
const processFormData = (formData) => {
  
  const date = formData.get('datum');
  const title = formData.get('titel');
  const text = formData.get('beschreibung');
  const zeit = formData.get('Uhrzeit');
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
    return test != "Invalid Date" && date.length >= 10;
};

export const isValidText = (text) => text.length >= 3;
