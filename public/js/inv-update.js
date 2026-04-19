'use strict'

// Enable the submit button immediately on page load so re-rendered forms
// with validation errors still allow the user to click Update Vehicle
const updateBtn = document.querySelector("#submitBtn")
if (updateBtn) {
  updateBtn.removeAttribute("disabled")
}

// Also re-enable on any field change
const updateForm = document.querySelector("#updateForm")
if (updateForm) {
  updateForm.addEventListener("change", function () {
    const btn = document.querySelector("#submitBtn")
    if (btn) btn.removeAttribute("disabled")
  })

  // ── Confirmation prompt before submitting the update ──────
  updateForm.addEventListener("submit", function (e) {
    // Client-side validation already ran (separate IIFE below).
    // Only show confirm if the form is actually valid.
    const makeEl  = document.getElementById("inv_make")
    const modelEl = document.getElementById("inv_model")
    const make  = makeEl  ? makeEl.value.trim()  : "this vehicle"
    const model = modelEl ? modelEl.value.trim() : ""
    const name  = (make && model) ? `${make} ${model}` : "this vehicle"

    // Show native browser confirm dialog
    const confirmed = window.confirm(
      `Are you sure you want to update "${name}"?\n\nClick OK to save changes, or Cancel to go back.`
    )
    if (!confirmed) {
      e.preventDefault()
    }
  }, true) // use capture so this runs after the validation IIFE
}

// ── Classification dropdown — clear fields when "Choose a Classification" selected ──
const clsSelect = document.getElementById("classificationList")
if (clsSelect) {
  clsSelect.addEventListener("change", function () {
    if (!this.value || this.value === "") {
      // User chose the blank option — clear all vehicle fields
      const fields = ["inv_make", "inv_model", "inv_year", "inv_description",
                      "inv_image", "inv_thumbnail", "inv_price", "inv_miles", "inv_color"]
      fields.forEach(function (id) {
        const el = document.getElementById(id)
        if (el) el.value = ""
      })
    }
  })
}
