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
* Build the vehicle detail view HTML  (Task 1)
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
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
