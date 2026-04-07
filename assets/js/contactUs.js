function initCaps(val) {
  return val.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}
function onlyLowercase(val) {
  return val.replace(/\s/g, '').toLowerCase();
}
function onlyDigits(val) {
  return val.replace(/[^\d+ ]/g, '');;
}
function firstCharCaps(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const backBtn = document.getElementById("back-btn");
  const successDiv = document.getElementById("thankYouMessage");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("mobNum");
  const emailInput = document.getElementById("email");
  const companyInput = document.getElementById("company");
  const msgInput = document.getElementById("msg");
  const check = document.getElementById("flexCheckDefault");

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const emailError = document.getElementById("emailError");
  const companyError = document.getElementById("companyError");
  const msgError = document.getElementById("msgError");

  // Clear error and remove red border on input
  nameInput.addEventListener('input', () => {
    nameInput.value = initCaps(nameInput.value);
    clearError(nameInput);
  });

  companyInput.addEventListener('input', () => {
    companyInput.value = initCaps(companyInput.value);
    clearError(companyInput);
  });

  emailInput.addEventListener('input', () => {
    emailInput.value = onlyLowercase(emailInput.value);
    clearError(emailInput);
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = onlyDigits(phoneInput.value);
    clearError(phoneInput);
  });

  msgInput.addEventListener('input', () => {
    msgInput.value = firstCharCaps(msgInput.value)
    clearError(msgInput);
  });

  function clearError(input) {
    if (input === nameInput) {
      nameError.textContent = "";
      nameInput.classList.remove("input-error");
    } else if (input === phoneInput) {
      phoneError.textContent = "";
      phoneInput.classList.remove("input-error");
    } else if (input === emailInput) {
      emailError.textContent = "";
      emailInput.classList.remove("input-error");
    } else if (input === companyInput) {
      companyError.textContent = "";
      companyInput.classList.remove("input-error");
    } else if (input === msgInput) {
      msgError.textContent = "";
      msgInput.classList.remove("input-error");
    } 
  }

  function validateForm() {
    let valid = true;
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

    clearError(nameInput);
    clearError(phoneInput);
    clearError(emailInput);
    clearError(companyInput);
    clearError(msgInput);

    if (nameInput.value.trim() === "") {
      nameError.textContent = "Name is required.";
      nameInput.classList.add("input-error");
      valid = false;
    } else if (emailInput.value.trim() === "") {
      emailError.textContent = "Email is required.";
      emailInput.classList.add("input-error");
      valid = false;
    } else if (!emailValid.test(emailInput.value.trim())) {
      emailError.textContent = "Enter a valid email address.";
      emailInput.classList.add("input-error");
      valid = false;
    } else if (phoneInput.value && phoneInput.value.length < 10) {
      phoneError.textContent = "Invalid Phone Number.";
      phoneInput.classList.add("input-error");
      valid = false;
    } else if (companyInput.value.trim() === "") {
      companyError.textContent = "Company is required.";
      companyInput.classList.add("input-error");
      valid = false;
    } else if (msgInput.value.trim() === "") {
      msgError.textContent = "Message is required.";
      msgInput.classList.add("input-error");
      valid = false;
    } else return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateForm()) {
      const name = nameInput.value.trim();
      const mail = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const company = companyInput.value.trim();
      const message = msgInput.value.trim();
      const reqBody = {
        mailType: "Contact Info",
        contactCompany: company,
        company: "MetrixIT Solutions",
        cCode: "MIT",
        name,
        mail,
        mobileNum: phone,
        subject: "MetrixIT Web - Contact Info",
        message,
        content: `<p>Please find the following <b>Contact Info</b><br><br> 
                  Name: <b>${name}</b><br> 
                  Email: <b>${mail}</b><br> 
                  ${phone ? `Phone: <b>${phone}</b><br>` : ``}
                  Company: <b>${company}</b><br><br> 
                  <b>Message:</b> ${message}<br></p>`
      };
      fetch("https://mailapi.skillworksit.com/psend/cust/send/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      }).then(resObj => {
        if (resObj.status == '200') {
          form.style.display = "none";
          const successDiv = document.getElementById("thankYouMessage");
          successDiv.style.display = "block";
          const backBtn = document.getElementById("back-btn");
          backBtn.style.display = "block";
        } else {
          const errorDiv = document.getElementById("formMessage");
          errorDiv.textContent = "Contact Us form submission failed. Please try again.";
          errorDiv.style.color = "red";
          errorDiv.style.textAlign = 'center';
        }
      }).catch(error => {
        const errorDiv = document.getElementById("formMessage");
        errorDiv.textContent = "Contact Us form submission failed. Please try again.";
        errorDiv.style.color = "red";
        errorDiv.style.textAlign = 'center';
      });
    }
  });
  backBtn.addEventListener("click", function () {
    form.style.display = "block";
    successDiv.style.display = "none";
    backBtn.style.display = "none";
    form.reset();
  });
});