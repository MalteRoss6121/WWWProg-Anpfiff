import { createContext } from './framework/context.js';
import { handleIndex, handleAbout, handleAddGet, handleAddPost, handleEdit } from './notes/controller.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import nunjucks from "npm:nunjucks@3.2.4";

const db = new DB("./data/data.sqlite");

nunjucks.configure("templates", { 
	autoescape: true, 
	noCache: true 
	});


export const handleRequest = async (request) => {
  let context = createContext(request, { db: db, staticPath: "web"});

  const url = context.Url;
  const requests = context.request;

  if (url.pathname === "/") {
    context = await handleIndex(context, db, nunjucks);
  } else if (url.pathname === "/about") {
    context = await handleAbout(context, nunjucks);
  } else if (url.pathname === "/add") {
    if (context.request.method === 'GET') {
      context = await handleAddGet(context, nunjucks);
    } else if (context.request.method === 'POST') {
      context = await handleAddPost(context, db, requests, nunjucks);
    }
  } else if (url.pathname.startsWith("/edit")) {
    context = await handleEdit(context, db, requests, nunjucks);
  }

  if (!context.response || !context.response.status) {
    context.response = {
      body: '404 - Not Found',
      status: 404,
      headers: new Headers().set("content-type", "text/plain"),
    };
  }

  return new Response(context.response.body, {
    status: context.response.status,
    headers: context.response.headers,
  });
};

