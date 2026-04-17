const pool = require("../database/")

/* ***************************
 *  Add a vehicle to a client's favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql =
      "INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    // UNIQUE constraint violation — already in favorites
    if (error.code === "23505") {
      return { duplicate: true }
    }
    console.error("addFavorite error:", error)
    return null
  }
}

/* ***************************
 *  Remove a vehicle from a client's favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql =
      "DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount
  } catch (error) {
    console.error("removeFavorite error:", error)
    return 0
  }
}

/* ***************************
 *  Get all favorites for a client (with full vehicle details)
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT
        f.favorite_id,
        f.added_date,
        i.inv_id,
        i.inv_make,
        i.inv_model,
        i.inv_year,
        i.inv_price,
        i.inv_thumbnail,
        i.inv_image,
        i.inv_color,
        i.inv_miles
      FROM public.favorites f
      JOIN public.inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.added_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error:", error)
    return []
  }
}

/* ***************************
 *  Check if a vehicle is already in a client's favorites
 * ************************** */
async function isFavorite(account_id, inv_id) {
  try {
    const sql =
      "SELECT 1 FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("isFavorite error:", error)
    return false
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccountId,
  isFavorite,
}
