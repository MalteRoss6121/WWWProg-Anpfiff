// controller.js
import * as view from './view.js';
import * as model from "./model.js";
import { handleForm } from './formController.js';

export const handleIndex = async (ctx, db) => {
  const body = await view.renderIndex(await model.index(db));
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAbout = async (ctx) => {
  const body = await view.renderAbout();
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAddGet = async (ctx) => {
  const body = await view.renderForm([], []);
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAddPost = async (ctx, db, request) => {
  const formData = await request.formData();
  const { date, title, text, formErrors } = processFormData(formData);

  if (Object.keys(formErrors).length > 0) {
    return handleForm(ctx, formData, formErrors);
  }

  model.add(db, { date, title, text });
  ctx.response = createRedirectResponse('http://localhost:8080/', 303);
  return ctx;
};

export const handleEdit = async (ctx, db, request) => {
  const url = ctx.Url;
  const noteId = parseInt(url.pathname.split("/")[2], 10);
  const note = await model.getById(db, noteId);

  if (request.method === 'GET') {
    const body = await view.renderForm(note, {});
    return createResponse(ctx, body, 200, "text/html");
  }

  if (request.method === 'POST') {
    const formData = await request.formData();
    const { date, title, text, formErrors } = processFormData(formData);

    if (Object.keys(formErrors).length > 0) {
      return handleForm(ctx, formData, formErrors);
    }

    await model.update(db, { date, title, text }, noteId);
    ctx.response = createRedirectResponse('http://localhost:8080/', 303);
    return ctx;
  }
};

// Hilfsfunktionen
const processFormData = (formData) => {
  
  const date = formData.get('date');
  const title = formData.get('title');
  const text = formData.get('text');

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

  return { date, title, text, formErrors };
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
