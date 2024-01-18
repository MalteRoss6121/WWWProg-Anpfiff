import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const index = async (db) => {
  const sql = "SELECT * FROM events";
  const result = db.queryEntries(sql); 
  return result;
};

export const profile = async (db) => {
  const sql = "SELECT name, permissions FROM benutzer";
  const result = db.queryEntries(sql); 
  return result;
};

export const getEmails = async (db, formData) => {
  const sql = "SELECT * FROM benutzer WHERE email = $email";
  const result = db.queryEntries(sql, {$email: formData.email}); 
  return result;
}

export const getById = async (db, id) => {
  const sql = "SELECT * FROM events WHERE EID = $id";
  const result = await db.queryEntries(sql, { $id: id });
  return result.length > 0 ? result[0] : null;
};

export const getAdmin = async (db, email) => {
  const sql = "SELECT permissions FROM benutzer WHERE email = $email"
  const result = await db.queryEntries(sql, {$email: email});
  return result;
};

export const getProfile = async (db, email) => {
  const sql = "SELECT name, events FROM benutzer WHERE email = $email"
  const result = await db.queryEntries(sql,{$email: email});
  return result;
};

export const updateProfile = async (db, formData, email) => {
  const sql = "UPDATE benutzer SET name = $name, events = $events WHERE email = $email";
  await db.queryEntries(sql, { $name: formData.name, $events: formData.events, $email: email });
};

export const updateProfilePerms = async (db, formData) => {
  const sql = "UPDATE benutzer SET permissions = $perms WHERE name = $name";
  await db.queryEntries(sql, { $name: formData.checkname, $perms: formData.perms });
};

export const addEventToProfile = async (db, email, eventTitle) => {
  const existingUser = await db.queryEntries("SELECT * FROM benutzer WHERE email = $email", { $email: email });

  if (existingUser.length === 0) {
    // If the user doesn't exist, insert a new row
    const insertSql = "INSERT INTO benutzer (email, events) VALUES ($email, $eventTitle)";
    await db.queryEntries(insertSql, { $email: email, $eventTitle: eventTitle });
  } else {
    const eventsArray = existingUser[0].events ? existingUser[0].events.split(',') : [];
    const isTitleExists = eventsArray.includes(eventTitle);

    if (!isTitleExists) {
      const updateSql = "UPDATE benutzer SET events = CASE WHEN events = '' THEN $eventTitle ELSE events || ', ' || $eventTitle END WHERE email = $email";
    await db.queryEntries(updateSql, { $email: email, $eventTitle: eventTitle });

      const name = existingUser[0].name || '';
      const addToEventsSql = `
        UPDATE events
        SET angemeldet = COALESCE(angemeldet || ',', '') || $name
        WHERE titel = $eventTitle
      `;
      await db.queryEntries(addToEventsSql, { $eventTitle: eventTitle, $name: name });
    }
  }
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


export const add = async (db, formData) => {
  const sql = "INSERT INTO events (titel, beschreibung, datum, tag, uhrzeit, bildurl) VALUES ( $titel, $beschreibung, $datum, $tag, $uhrzeit, $bildurl)";
  await db.queryEntries(sql, { $titel: formData.title, $beschreibung: formData.text, $datum: formData.date, $tag: formData.tag, $uhrzeit: formData.zeit, $bildurl: formData.bild });
};


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

export const deleteEvent = async (db, id) => {
  const sql = "DELETE FROM events WHERE EID = $id";
  await db.queryEntries(sql, {
    $id: id,
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


export const getUserByEmail = async (db, email) => {
  const sql = "SELECT * FROM benutzer WHERE email = $email LIMIT 1";
  const result = await db.query(sql, { $email: email });
  console.log('Result:', result)
  return result.length > 0 ? result[0] : null;
 };

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


export const authenticateUser = async (db, email, password) => {
  const user = await getUserByEmail(db, email);
  if (user) {
    const match = await bcrypt.compare(password, user[3]);
    return match;
  }
 
  return false;
 };