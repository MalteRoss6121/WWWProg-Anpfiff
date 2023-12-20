
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
  const sql = "SELECT * FROM events WHERE id = $id";
  const result = await db.queryEntries(sql, { $id: id });
  return result.length > 0 ? result[0] : null;
};

/**
 * Add a note to the database.
 * @param {object} db - Database connection
 * @param {Record<string, any>} formData
 */
export const add = async (db, formData) => {
  const sql = "INSERT INTO events (title, text, date) VALUES ( $title, $text, $date)";
  await db.queryEntries(sql, { $title: formData.title, $text: formData.text, $date: formData.date });
};

/**
 * Update a note in the database.
 * @param {object} db - Database connection
 * @param {Record<string, any>} formData
 * @param {Integer} id
 */
export const update = async (db, formData, id) => {
  const sql = "UPDATE events SET title = $title, text = $text, date = $date WHERE id = $id";
  await db.queryEntries(sql, {
    $id: id,
    $title: formData.title,
    $text: formData.text,
    $date: formData.date,
  });
};
