/**
 * Used Self invoking functions to keep the functions private  as they are not required other places
 * and not to pollute the global namespace 
 */
(function () {
  // selectors are cached for reuse  
  var floatingLabel = document.getElementById("floating-label");
  var email = document.getElementById("email-input");
  var loader = document.getElementById("loader");
  var errorMessage = document.getElementById("err");
  var noRresult = document.getElementById("no-result");
  var resultContainer = document.getElementById("result-container");
  var name = document.getElementById("name");  
  var description = document.getElementById("description");
  var address = document.getElementById("address");
  var resultEmailId = document.getElementById("result-emailId");
  var phoneList = document.getElementById("phoneList");
  var relativesList = document.getElementById("relativesList");
  var data = {};

  // bind event listeners to the selectors
  window.onload = handleOnLoad;
  search.addEventListener("click", handleSearchClick);
  email.addEventListener("blur", validateEmail);

  toggleContainer(resultContainer, false);
  toggleContainer(noRresult, true);

  function handleOnLoad() {
    let url = window.location.href;    
    if(!url.includes('?')){
      toggleLoader(false);
      return;
    }

    extractParamsFromUrl();
    if (isValidEmail(data.email)) {
      email.value = data.email;
      searchByEmail(data.email);
    } else {
      // handle invalid email
    }
  }

  function toggleLoader(visible) {
    loader.style.visibility = visible ? "visible" : "hidden";
  }

  function toggleContainer(container,isDisplayed){
    container.style.display = isDisplayed ? "block" : "none";
  }

  function extractParamsFromUrl() {
    var url = document.location.href,
      params = url.split("?")[1].split("&"),
      tmp;
    for (var i = 0, l = params.length; i < l; i++) {
      tmp = params[i].split("=");
      data[tmp[0]] = tmp[1];
    }
  }

  function searchByEmail(email) {
    try {
      toggleLoader(true);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          displayUserDetails(this.responseText);
        }
      };
      let url = `https://cors-anywhere.herokuapp.com/https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${email}`;
      xhttp.open("GET", url, true);
      xhttp.send();
    } catch (err) {
      errorMessage.innerHTML = err.message;
    }
  }

  function handleSearchClick() {
    if(validateEmail()) {
        searchByEmail(email.value)
    }
  }

  function displayUserDetails(response) {
    try {
      if (JSON.parse(response).first_name) {
        let obj = JSON.parse(response);

        name.innerHTML  = `${obj.first_name}  ${obj.last_name}`;
        description.innerHTML  = `${obj.description}`;
        address.innerHTML  = `${obj.address}`;
        resultEmailId.innerHTML = `${obj.email}`;

        let phonList = "";
        for (let i = 0; i < obj.phone_numbers.length; i++) {
          phonList += `<li>${obj.phone_numbers[i]}</li>`;
        }
        phoneList.innerHTML  = phonList; 

        let relList = "";
        for (let i = 0; i < obj.relatives.length; i++) {
          relList += `<li>${obj.relatives[i]}</li>`;
        }
        relativesList.innerHTML  = relList;
        toggleContainer(resultContainer, true);
        toggleContainer(noRresult, false);
        email.classList.remove("error"); 
      } else {
        floatingLabel.innerHTML = "User Does not exist";
        floatingLabel.className = "error-message";
        noRresult.innerHTML = "<h2>User does not exist</h2>";
        email.classList.add("error");
        toggleContainer(resultContainer, false);
        toggleContainer(noRresult, true);
      }
      toggleLoader(false);
    } catch (err) {
      errorMessage.innerHTML = err.message;
      toggleLoader(false);
    }
  }

  function validateEmail() {
    var isValid = isValidEmail(email.value);

    if (isValid) {
      floatingLabel.innerHTML = "Email";
      floatingLabel.className = "floating-label";
      email.classList.remove("error");
    } else {
      floatingLabel.innerHTML = "Please add a valid email address";
      floatingLabel.className = "error-message";
      email.classList.add("error");
    }
    return isValid;
  }
})();
