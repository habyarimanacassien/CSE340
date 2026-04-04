const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = function(data) {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(data.inv_price)

  const miles = new Intl.NumberFormat('en-US').format(data.inv_miles)

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image-col">
        <img
          src="${data.inv_image}"
          alt="Full size image of ${data.inv_year} ${data.inv_make} ${data.inv_model}"
        />
      </div>
      <div class="vehicle-info">
        <p class="vehicle-price">${price}</p>
        <table class="vehicle-specs">
          <tbody>
            <tr><th scope="row">Year</th><td>${data.inv_year}</td></tr>
            <tr><th scope="row">Make</th><td>${data.inv_make}</td></tr>
            <tr><th scope="row">Model</th><td>${data.inv_model}</td></tr>
            <tr><th scope="row">Color</th><td>${data.inv_color}</td></tr>
            <tr><th scope="row">Mileage</th><td>${miles} miles</td></tr>
          </tbody>
        </table>
        <div class="vehicle-description">
          <h3>Description</h3>
          <p>${data.inv_description}</p>
        </div>
      </div>
    </div>
  `
}

/* ****************************************
 * Build the classification select list
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Check data — add classification
 **************************************** */
Util.checkClassificationData = function (req, res, next) {
  const { classification_name } = req.body
  const errors = []

  if (!classification_name || classification_name.trim() === "") {
    errors.push({ msg: "Classification name is required." })
  } else if (!/^[a-zA-Z0-9]+$/.test(classification_name.trim())) {
    errors.push({ msg: "Classification name cannot contain spaces or special characters." })
  }

  if (errors.length > 0) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav,
      errors,
      classification_name,
    })
  }
  next()
}

/* ****************************************
 * Check data — add inventory
 **************************************** */
Util.checkInventoryData = function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body
  const errors = []

  if (!classification_id) errors.push({ msg: "Please select a classification." })
  if (!inv_make || inv_make.trim().length < 3) errors.push({ msg: "Make must be at least 3 characters." })
  if (!inv_model || inv_model.trim().length < 3) errors.push({ msg: "Model must be at least 3 characters." })
  if (!inv_year || isNaN(inv_year) || inv_year < 1900 || inv_year > 2099)
    errors.push({ msg: "Year must be a valid 4-digit year between 1900 and 2099." })
  if (!inv_description || inv_description.trim() === "")
    errors.push({ msg: "Description is required." })
  if (!inv_image || inv_image.trim() === "") errors.push({ msg: "Image path is required." })
  if (!inv_thumbnail || inv_thumbnail.trim() === "") errors.push({ msg: "Thumbnail path is required." })
  if (!inv_price || isNaN(inv_price) || parseFloat(inv_price) < 0)
    errors.push({ msg: "Price must be a positive number." })
  if (!inv_miles || isNaN(inv_miles) || parseInt(inv_miles) < 0)
    errors.push({ msg: "Miles must be a positive number." })
  if (!inv_color || inv_color.trim().length < 3) errors.push({ msg: "Color must be at least 3 characters." })

  if (errors.length > 0) {
    // Build the classification list before re-rendering
    invModel.getClassifications().then((data) => {
      let classificationList =
        '<select name="classification_id" id="classificationList" required>'
      classificationList += "<option value=''>Choose a Classification</option>"
      data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (classification_id != null && row.classification_id == classification_id) {
          classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
      })
      classificationList += "</select>"

      return res.status(400).render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav: res.locals.nav,
        errors,
        classificationList,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
    })
    return
  }
  next()
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
