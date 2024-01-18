import { createContext } from "./framework/context.js";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";
import {
  handleAbout,
  handleAddGet,
  handleAddPost,
  handleEdit,
  handleEvents,
  handleIndex,
  handleRegisterGet,
  handleRegisterPost,
  handleLoginGet,
  handleLoginPost,
  handleProfile,
  handleAboutPost,
  handleERROR,
  handleDelete,
  handleEvent,
  handleLogoutGet,
  handleLogoutPost,
  handleDoku,
} from "./notes/controller.js";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import nunjucks from "npm:nunjucks@3.2.4";
import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";
const db = new DB("./data/data.sqlite");

nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});

export const createSessionStore = () => {
  const sessionStore = new Map();
  return {
    get(key) {
      const data = sessionStore.get(key);
      if (!data) { return }
      return data.maxAge < Date.now() ? this.destroy(key) : data.session;
    },
    set(key, session, maxAge) {
      sessionStore.set(key, {
        session, maxAge: Date.now() + maxAge
      });
    },
    destroy(key) {
      sessionStore.delete(key);
    }
  };
};

const SESSION_KEY = 'my_app.session';
const MAX_AGE = 60 * 60 * 1000;
const sessionStore = createSessionStore();

export const handleRequest = async (request) => {
  let context = createContext(request, { db: db, staticPath: "web" });
  const requests = context.request;
  const url = context.Url;
  

  context.sessionStore = sessionStore; 
  context.cookies = new CookieMap(requests); 
  context.sessionId = context.cookies.get(SESSION_KEY); 
  context.session = context.sessionStore.get(context.sessionId, MAX_AGE) ?? {};
    

  if (url.pathname === "/") {
    context = await handleIndex(context, db, nunjucks);
  } else if (url.pathname === "/about") {
    if (context.request.method === "GET") {
      context = await handleAbout(db, context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleAboutPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname === "/add") {
    if (context.request.method === "GET") {
      context = await handleAddGet(context, db, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleAddPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname.startsWith("/edit")) {
    context = await handleEdit(context, db, requests, nunjucks);
  } else if (url.pathname.startsWith("/events")) {
    context = await handleEvents(context, db, nunjucks, url);
  } else if (url.pathname === "/register") {
    if (context.request.method === "GET") {
      context = await handleRegisterGet(context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleRegisterPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname === "/login") {
    if (context.request.method === "GET") {
      context = await handleLoginGet(context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleLoginPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname === "/logout") {
    if (context.request.method === "GET") {
      context = await handleLogoutGet(context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleLogoutPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname === "/profile") {
    context = await handleProfile(context, db, requests, nunjucks);
  } else if (url.pathname.startsWith("/dele")) {
    context = await handleDelete(context, db, requests, nunjucks);
  } else if (url.pathname.startsWith("/event")) {
    context = await handleEvent(context, db, requests, nunjucks);
  } else if(url.pathname === "/doku"){
    context = await handleDoku(context, db, nunjucks);
  }
  else {
    context = await handleERROR(context, nunjucks);
  }
  if (!context.response || !context.response.status) {
    context = await handleERROR(context, nunjucks);
  }

  if (context.session.user) {
    const usernew = context.session.user;
    const sessionId = context.sessionId || createUniqueSessionID();
    context.session = context.sessionStore.set(sessionId, context.session, MAX_AGE);
    context.cookies.set(SESSION_KEY, sessionId);
    console.log("Session aktiv | User: " , usernew);

    const newheader = mergeHeaders(context.response.headers, context.cookies);

   return new Response(context.response.body,{
      status: context.response.status,
      headers: newheader
    });
  }

  return new Response(context.response.body, {
    status: context.response.status,
    headers: context.response.headers,
  });
};

export const createUniqueSessionID = () => {
  return v4.generate();
};