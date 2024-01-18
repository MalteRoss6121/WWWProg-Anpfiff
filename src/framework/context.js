import { CookieMap, mergeHeaders } from "https://deno.land/std/http/mod.ts";
export const createContext = (request, extras) => ({
  request,
  Url: new URL(request.url),
  response: {
    body: undefined,
    status: 200,
    headers: new Headers({
      'Content-Type': "text/html",
    }),
    cookies: request.cookies,
  },
  db: extras.db,
  staticPath: extras.staticPath,
  nunjucks: extras.nunjucks,
  sessionStore: extras.sessionStore,
  cookies: new CookieMap(request),
  sessionId: undefined,
  session: {},
  ...extras
});