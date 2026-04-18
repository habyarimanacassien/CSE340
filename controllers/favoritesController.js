const utilities = require("../utilities/")
const favModel = require("../models/favorites-model")

/* ***************************
 *  Build the Saved Favorites view
 * ************************** */
async function buildFavoritesView(req, res, next) {
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()
  const favorites = await favModel.getFavoritesByAccountId(account_id)

  res.render("account/favorites", {
    title: "My Saved Favorites",
    nav,
    errors: null,
    favorites,
  })
}

/* ***************************
 *  Add a vehicle to favorites (POST)
 * ************************** */
async function addFavorite(req, res, next) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  const result = await favModel.addFavorite(account_id, inv_id)

  if (result && result.duplicate) {
    req.flash("notice", "This vehicle is already in your favorites.")
  } else if (result) {
    req.flash("notice", "Vehicle added to your favorites!")
  } else {
    req.flash("notice", "Sorry, could not add to favorites. Please try again.")
  }

  // Return the user to wherever they came from
  const referer = req.get("Referer") || "/account/favorites"
  res.redirect(referer)
}

/* ***************************
 *  Remove a vehicle from favorites (POST)
 * ************************** */
async function removeFavorite(req, res, next) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  const deleted = await favModel.removeFavorite(account_id, inv_id)

  if (deleted) {
    req.flash("notice", "Vehicle removed from your favorites.")
  } else {
    req.flash("notice", "Sorry, could not remove that favorite.")
  }

  res.redirect("/favorites/")
}

module.exports = { buildFavoritesView, addFavorite, removeFavorite }
