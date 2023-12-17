// formController.js
import * as view from './view.js';
import * as model from "./model.js";

export const handleForm = async (ctx, formData, formErrors) => {
  const body = await view.renderForm(formData, formErrors);
  return createResponse(ctx, body, 400, "text/html");
};

// Helper functions
const createResponse = (ctx, body, status, header) => {
  ctx.response.body = body;
  ctx.response.headers.set("content-type", header);
  ctx.response.status = status;
  return ctx;
};
