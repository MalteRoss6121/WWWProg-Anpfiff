import { createContext } from './framework/context.js';
import { handleIndex, handleAbout, handleAddGet, handleAddPost, handleEdit } from './notes/controller.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("./data/notes.sqlite");


export const handleRequest = async (request) => {
  let context = createContext(request, { db: db, staticPath: "web"});

  const url = context.Url;
  const requests = context.request;

  if (url.pathname === "/") {
    context = await handleIndex(context, db);
  } else if (url.pathname === "/about") {
    context = await handleAbout(context);
  } else if (url.pathname === "/add") {
    if (context.request.method === 'GET') {
      context = await handleAddGet(context, db, requests);
    } else if (context.request.method === 'POST') {
      context = await handleAddPost(context, db, requests);
    }
  } else if (url.pathname.startsWith("/edit")) {
    context = await handleEdit(context, db, requests);
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

