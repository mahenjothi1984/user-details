/**
 * Used Self invoking functions to keep the functions private  as they are not required other places
 * and not to pollute the global namespace 
 */
(function () {
  // selectors are cached for reuse  
  var search = document.getElementById("search");
  var email = document.getElementById("email-input");
  var floatingLabel = document.getElementById("floating-label");
  
  // bind event listeners to the selectors
  search.addEventListener("click", handleSearchClick);
  email.addEventListener("blur", validateEmail);

  function handleSearchClick() {
    if(validateEmail()) {
        searchByEmail(email.value)
    }
  }

  function validateEmail() {
    var isValid = isValidEmail(email.value)

    if (isValid) {
      floatingLabel.innerHTML = "Email";
      floatingLabel.className = "floating-label";
      email.classList.remove("error");
    } else {
      floatingLabel.innerHTML = "Please add a valid Email Adress";
      floatingLabel.className = "error-message";
      email.classList.add("error");
    }

    return isValid;
  }

  function searchByEmail(email) {
    url = `./result.html?email=${email}`;
    document.location.href = url;
  }
})();
