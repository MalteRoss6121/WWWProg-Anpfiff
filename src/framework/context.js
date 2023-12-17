export const createContext = (request, extras) => ({
  request,
  Url: new URL(request.url),
  response: {
    body: undefined,
    status: 200, 
    headers: new Headers({
      'Content-Type': "text/html", 
    }),
  },
  db: extras.db,
  staticPath: extras.staticPath,
 ...extras 
 });