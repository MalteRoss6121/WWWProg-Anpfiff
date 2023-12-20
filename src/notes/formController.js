// formController.js

import * as model from "./model.js";

export const handleForm = async (ctx, formData, formErrors, nunjucks) => {
  const body = nunjucks.render('form.html', {formData,formErrors});
  return createResponse(ctx, body, 400, "text/html");
};

// Helper functions
const createResponse = (ctx, body, status, header) => {
  ctx.response.body = body;
  ctx.response.headers.set("content-type", header);
  ctx.response.status = status;
  return ctx;
};
