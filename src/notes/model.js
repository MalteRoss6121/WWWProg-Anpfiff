import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
/**
 * Get all notes from the database.
 * @param {object} db - Database connection
 * @returns {Promise<Array<Record<string, any>>>}
 */
export const index = async (db) => {
  const sql = "SELECT * FROM events";
  const result = db.queryEntries(sql); 
  return result;
};

/**
 * Get one note by id from the database.
 * @param {object} db - Database connection
 * @param {Integer} id
 * @returns {Promise<Record<string, any> | null>}
 */
export const getById = async (db, id) => {
  const sql = "SELECT * FROM events WHERE EID = $id";
  const result = await db.queryEntries(sql, { $id: id });
  return result.length > 0 ? result[0] : null;
};

export const getEventsByTag = async (db, tag) => {
  const sql = "SELECT * FROM events WHERE tag = $tag";
  const result = await db.queryEntries(sql, { $tag: tag });
  return result;
};
export const getEventsByTitle = async (db, title) => {
  const sql = "SELECT * FROM events WHERE titel = $titel";
  const result = await db.queryEntries(sql, { $titel: title });
  return result;
};

/**
 * Add a note to the database.
 * @param {object} db - Database connection
 * @param {Record<string, any>} formData
 */
export const add = async (db, formData) => {
  const sql = "INSERT INTO events (titel, beschreibung, datum, tag, uhrzeit, bildurl) VALUES ( $titel, $beschreibung, $datum, $tag, $uhrzeit, $bildurl)";
  await db.queryEntries(sql, { $titel: formData.title, $beschreibung: formData.text, $datum: formData.date, $tag: formData.tag, $uhrzeit: formData.zeit, $bildurl: formData.bild });
};

/**
 * Update a note in the database.
 * @param {object} db - Database connection
 * @param {Record<string, any>} formData
 * @param {Integer} id
 */
export const update = async (db, formData, id) => {
  const sql = "UPDATE events SET titel = $title, beschreibung = $text, datum = $date, tag = $tag, uhrzeit = $zeit, bildurl = $bildurl WHERE EID = $id";
  await db.queryEntries(sql, {
    $id: id,
    $title: formData.title,
    $text: formData.text,
    $date: formData.date,
    $tag: formData.tag,
    $zeit: formData.zeit,
    $bildurl: formData.bild,
  });
};

export const updateContact = async (db, formData, id) => {
  const sql = "UPDATE kontakt SET titel = $title, text = $text, vorname = $vorname, nachname = $nachname WHERE KID = $id";
  await db.queryEntries(sql, {
    $id: id,
    $title: formData.titel,
    $text: formData.text,
    $vorname: formData.vorname,
    $nachname: formData.nachname,
  });
};

export const addContact = async (db, formData, id) => {
  const sql = "INSERT INTO kontakt (titel, text, vorname, nachname) VALUES ($title, $text, $vorname, $nachname)";
  await db.queryEntries(sql, {
    $title: formData.titel,
    $text: formData.text,
    $vorname: formData.vorname,
    $nachname: formData.nachname,
  });
};

/**
 * Get user by email from the database.
 * @param {object} db - Database connection
 * @param {string} email
 * @returns {Promise<Array<Record<string, any>>>}
 */
export const getUserByEmail = async (db, email) => {
  const sql = "SELECT * FROM benutzer WHERE email = $email";
  const result = await db.query(sql, { $email: email });
  return result;
};
/**
 * Register a new user in the database.
 * @param {object} db - Database connection
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export const registerUser = async (db, email, password, username) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const sql = "INSERT INTO benutzer (email, passwort, name) VALUES ($email, $passwort, $name)";
  try {
  const result = await db.query(sql, { $email: email, $passwort: hashedPassword, $name: username });
  return result ? true : false;
  } catch (error) {
  console.error('Failed to register user:', error);
  return false;
  }
 };


/**
 * Authenticate user credentials against the database.
 * @param {object} db - Database connection
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export const authenticateUser = async (db, email, password) => {
  const user = await getUserByEmail(db, email);
 
  if (user && user.length > 0) {
    const match = await bcrypt.compare(password, user[0].password);
    return match;
  }
 
  return false;
 };