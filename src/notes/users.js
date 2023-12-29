// users.js

import { DB } from 'https://deno.land/x/sqlite/mod.ts';

const db = new DB("./data/data.sqlite");

export async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);

  if (user && user.length > 0) {
    return user[0].password === password;
  }

  return false;
}

export async function registerUser(email, password) {

  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.length > 0) {
    // chekc check jetpack
    return false;
  }

  const result = await db.query("INSERT INTO benutzer (email, passwort) VALUES (? , ?)", email, password);

  return result ? true : false;
}

async function getUserByEmail(email) {
  return await db.query("SELECT * FROM benutzer WHERE email = ?", email);
}
