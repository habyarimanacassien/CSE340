// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route for a specific vehicle detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Route to trigger intentional 500 error
router.get("/error", utilities.handleErrors(invController.triggerError))

// ── Task 1: Management view ──────────────────────────────────
router.get("/", utilities.handleErrors(invController.buildManagement))

// ── Task 2: Add Classification ───────────────────────────────
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// ── Task 3: Add Inventory ────────────────────────────────────
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
