// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
// process the update
const regValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route for a specific vehicle detail view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))

// Route to trigger intentional 500 error
router.get("/error", utilities.handleErrors(invController.triggerError))

// Management view — Employee/Admin only
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

// Add Classification — Employee/Admin only
router.get(
  "/add-classification",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory — Employee/Admin only
router.get(
  "/add-inventory",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// AJAX — get inventory JSON by classification (public — needed for management view)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// load the edit view — Employee/Admin only
router.get(
  "/edit/:inv_id",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update/",
  utilities.checkLogin, utilities.checkAccountType,
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete inventory — GET: confirmation view, POST: process delete
router.get(
  "/delete/:inv_id",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
)

router.post(
  "/delete/",
  utilities.checkLogin, utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
