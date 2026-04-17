// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const favoritesController = require("../controllers/favoritesController")

// View all saved favorites — requires login
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.buildFavoritesView)
)

// Add a vehicle to favorites — requires login
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.addFavorite)
)

// Remove a vehicle from favorites — requires login
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoritesController.removeFavorite)
)

module.exports = router
