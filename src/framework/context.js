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
  //sessionExists: request.cookies && request.cookies["session"] !== undefined,
  //sessionData: request.cookies && request.cookies["session"] !== undefined ? sessions.get(request.cookies["session"]) : null,
  ...extras 
 });