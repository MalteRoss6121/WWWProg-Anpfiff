// controller.js

import * as model from "./model.js";
import { handleForm, handleFormContact, handleLoginForm, processFormData, processRegisterFormData, processLoginFormData, processContactFormData, processProfileFormData  } from "./formController.js";
import { createUniqueSessionID } from "./utils.js";

export const handleIndex = async (ctx, db, nunjucks) => {
  const userlogin = ctx.session.user;
  const useradmin = await checkAdminStatus(db, ctx, userlogin);
  console.log("TEST",useradmin)

  console.log(ctx.session, userlogin);

  const body = nunjucks.render("index.html", {
      notes: await model.index(db),
      useradmin,
      userlogin,
  });
  return createResponse(ctx, body, 200, "text/html");
};

export const handleERROR = async (ctx, nunjucks) =>{
  const body = nunjucks.render("error404.html");
  return createResponse(ctx, body, 404, "text/html");
}


export const handleEvents = async (ctx, db, nunjucks, url) => {
  const tag = url.searchParams.get("tag");
  const title = url.searchParams.get("title");
  const userlogin = ctx.session.user;
  const useradmin = await checkAdminStatus(db, ctx, userlogin);

  let filteredNotes;
  if (tag && tag !== "alle") {
    filteredNotes = await model.getEventsByTag(db, tag);
  } else if (title) {
    filteredNotes = await model.getEventsByTitle(db, title);
  } else {
    filteredNotes = await model.index(db);
  }

  const body = nunjucks.render("events.html", { notes: filteredNotes, userlogin, useradmin });
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAbout = async (db, ctx, nunjucks) => {
  const userlogin = ctx.session.user;
  const useradmin = await checkAdminStatus(db, ctx, userlogin);
  console.log("TEST",useradmin)
  const body = nunjucks.render("about.html", {
    userlogin,
    useradmin,
  });
  return createResponse(ctx, body, 200, "text/html");
};

export const handleAboutPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { vorname, nachname, titel, text, formErrors } = processContactFormData(
    formData,
  );

  if (Object.keys(formErrors).length > 0) {
    return handleFormContact(ctx, formData, formErrors, nunjucks);
  }

  model.addContact(db, { vorname, nachname, titel, text });
  ctx.response = createRedirectResponse("http://localhost:8080/", 303);
  return ctx;
};

export const handleAddGet = async (ctx, db, nunjucks) => {
  const userlogin = ctx.session.user;
  const useradmin = await checkAdminStatus(db, ctx, userlogin);
  if (useradmin) {
    const body = nunjucks.render("form.html", {
      userlogin,
      useradmin,
    });
    return createResponse(ctx, body, 200, "text/html");
  } else {
    
    const body = nunjucks.render("error.html", {
      userlogin,
    });
    return createResponse(ctx, body, 200, "text/html");
  }
 };


export const handleAddPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { date, title, text, zeit, tag, bild, formErrors } = processFormData(
    formData,
  );

  if (Object.keys(formErrors).length > 0) {
    return handleForm(ctx, formData, formErrors, nunjucks);
  }

  model.add(db, { date, title, text, zeit, tag, bild });
  ctx.response = createRedirectResponse("http://localhost:8080/", 303);
  return ctx;
};

export const handleDelete = async (ctx, db, request, nunjucks) => {
  const url = ctx.Url;
  const noteId = parseInt(url.pathname.split("/")[2], 10);
  const note = await model.getById(db, noteId);

  if (!note) {
    return handleERROR(ctx,nunjucks);
  }

  if (request.method === "GET") {
    const body = nunjucks.render("delete.html", { formData: note });
    return createResponse(ctx, body, 200, "text/html");
  }

  if (request.method === "POST") {
    await model.deleteEvent(db, noteId);
    ctx.response = createRedirectResponse("http://localhost:8080/", 303);
    return ctx;
  }
};

export const handleEvent = async (ctx, db, request, nunjucks) => {
  const userlogin = ctx.session.user;
  const url = ctx.Url;
  const noteId = parseInt(url.pathname.split("/")[2], 10);
  const note = await model.getById(db, noteId);

  if (!note) {
    return handleERROR(ctx,nunjucks);
  }

  if (request.method === "GET") {
    const body = nunjucks.render("event.html", { formData: note , userlogin});
    return createResponse(ctx, body, 200, "text/html");
  }
  if (request.method === "POST"){
    console.log(note.titel);
    const userlogin = ctx.session.user;
    console.log(userlogin);
    await model.addEventToProfile(db, userlogin, note.titel);
    ctx.response = createRedirectResponse("http://localhost:8080/", 303);
    return ctx;
  }
};


export const handleEdit = async (ctx, db, request, nunjucks) => {
  const url = ctx.Url;
  const noteId = parseInt(url.pathname.split("/")[2], 10);
  const note = await model.getById(db, noteId);
  //console.log('Retrieved note from the database:', note);

  if (request.method === "GET") {
    const userlogin = ctx.session.user;
    const useradmin = await checkAdminStatus(db, ctx, userlogin);
    if (useradmin) {
      const body = nunjucks.render("form.html", {
        userlogin,
        useradmin,
      });
      return createResponse(ctx, body, 200, "text/html");
    } else {
      
      const body = nunjucks.render("error.html", {
        userlogin,
      });
      return createResponse(ctx, body, 200, "text/html");
    }
  }

  if (request.method === "POST") {
    const formData = await request.formData();
    const { date, title, text, zeit, tag, bild, formErrors } = processFormData(
      formData,
    );

    if (Object.keys(formErrors).length > 0) {
      return handleForm(ctx, formData, formErrors, nunjucks);
    }

    await model.update(db, { date, title, text, zeit, tag, bild }, noteId);
    ctx.response = createRedirectResponse("http://localhost:8080/", 303);
    return ctx;
  }
};

export const handleLoginGet = async (ctx, nunjucks) => {
  const body = nunjucks.render("login.html", {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleLoginPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const { formErrors } = processLoginFormData(formData);

  //console.log("Form errors:", formErrors);

  if (Object.keys(formErrors).length > 0) {
    // Handle form errors (render the login form with error messages)
    return handleLoginForm(ctx, formData, formErrors, nunjucks);
  }

  // Authenticate user
  const isUserAuthenticated = await model.authenticateUser(db, email, password);

  if (isUserAuthenticated) {
    // Set a cookie
    console.log(" ! NUTZER BESTÄTIGT !");
    

    ctx.session.user = email;
    console.log(ctx.session.user );
    ctx.response = createRedirectResponse("http://localhost:8080/", 303);
    return ctx;
  } else {
    console.log(" ! NICHT BESTÄTIGT !");
    formErrors.login = "Invalid email or password";
    return handleLoginForm(ctx, formData, formErrors, nunjucks);
  }
};
export const handleLogout = async (ctx, nunjucks) => {
  const sessionId = ctx.request.cookies["session"];
  sessions.delete(sessionId);
  deleteCookie(ctx.response, 'session');
  ctx.response = createRedirectResponse('http://localhost:8080/', 303);
  return ctx;
 };
 
 export const handleProfile = async (ctx, db, request, nunjucks) => {
  const userlogin = ctx.session.user;

    if (request.method === "GET") {
        // Retrieve user's profile information for pre-filling the form
        const profileResult = await model.getProfile(db, userlogin);

        if (profileResult && profileResult.length > 0) {
            const profileData = profileResult[0];
            const body = nunjucks.render("profile.html", {
                email: userlogin,
                name: profileData.name,
                events: profileData.events,
                userlogin,
            });
            return createResponse(ctx, body, 200, "text/html");
        }
    }

    if (request.method === "POST") {
        const formData = await request.formData();
        const { name, events, formErrors } = processProfileFormData(formData);

        if (Object.keys(formErrors).length > 0) {
            const body = nunjucks.render("profile.html", {
                email: userlogin,
                name,
                events,
                formErrors,
                userlogin,
            });
        }

        await model.updateProfile(db, { name, events }, userlogin);
        ctx.response = createRedirectResponse("http://localhost:8080/", 303);
        return ctx;
    }
};

export const handleRegisterGet = async (ctx, nunjucks) => {
  const body = nunjucks.render("register.html", {});
  return createResponse(ctx, body, 200, "text/html");
};

export const handleRegisterPost = async (ctx, db, request, nunjucks) => {
  const formData = await request.formData();
  const { email, password, username, formErrors } = processRegisterFormData(
    formData,
  );

  if (Object.keys(formErrors).length > 0) {
    return handleRegisterGet(ctx, nunjucks, formErrors);
  }

  // Register user
  const registrationResult = await model.registerUser(
    db,
    email,
    password,
    username,
  );

  if (!registrationResult) {
    console.error("!! User registration failed !!");
    return ctx;
  }

  console.log("!! User registration successful !!");

  ctx.response = createRedirectResponse("http://localhost:8080/login", 303);
  return ctx;
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

async function checkAdminStatus(db, ctx, userlogin) {
  let useradmin = null;
  const adminResult = await model.getAdmin(db, userlogin);
 
  if (adminResult && adminResult.length > 0) {
      const isAdmin = adminResult[0].permissions === 1;
      if (isAdmin) {
          useradmin = ctx.session.user;
      }
  }
  return useradmin;
 }

export const isValidDate = (date) => {
  const test = new Date(date);
  return test != "Invalid Date" && date.length >= 4;
};

export const isValidText = (text) => text.length >= 3;
