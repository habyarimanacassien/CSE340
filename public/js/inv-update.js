// Enable the submit button immediately on page load
const updateBtn = document.querySelector("#submitBtn")
if (updateBtn) {
  updateBtn.removeAttribute("disabled")
}

// Also enable it whenever the user changes any field
const form = document.querySelector("#updateForm")
if (form) {
  form.addEventListener("change", function () {
    const btn = document.querySelector("#submitBtn")
    if (btn) btn.removeAttribute("disabled")
  })
}
