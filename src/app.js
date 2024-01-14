import { createContext } from "./framework/context.js";
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
} from "./notes/controller.js";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { deleteCookie } from "https://deno.land/std/http/mod.ts";
import nunjucks from "npm:nunjucks@3.2.4";

const db = new DB("./data/data.sqlite");

nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});


export const handleRequest = async (request) => {
  let context = createContext(request, { db: db, staticPath: "web" });

  const url = context.Url;
  const requests = context.request;

  if (url.pathname === "/") {
    context = await handleIndex(context, db, nunjucks);
  } else if (url.pathname === "/about") {
    if(context.request.method === "GET"){
      context = await handleAbout(context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleAboutPost(context,db, requests,  nunjucks);
    }
  } else if (url.pathname === "/add") {
    if (context.request.method === "GET") {
      context = await handleAddGet(context, nunjucks);
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
  }  else if (url.pathname === "/login") {
    if (context.request.method === "GET") {
      context = await handleLoginGet(context, nunjucks);
    } else if (context.request.method === "POST") {
      context = await handleLoginPost(context, db, requests, nunjucks);
    }
  }  else if (url.pathname === "/logout") {
    context = await handleLogout(context, nunjucks);
    return context;
  } else if(url.pathname === "/profile"){
    context = await handleProfile(context, nunjucks);
  }else if(url.pathname.startsWith("/dele")){
    context = await handleDelete(context, db, requests, nunjucks);
  } else if(url.pathname.startsWith("/event")){
    context = await handleEvent(context, db, requests, nunjucks);
  } 
  else{
    context = await handleERROR(context, nunjucks);
  }
  if (!context.response || !context.response.status) {
    context = await handleERROR(context, nunjucks);
  }

  return new Response(context.response.body, {
    status: context.response.status,
    headers: context.response.headers,
  });
};

