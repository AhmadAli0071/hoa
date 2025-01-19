/**
 * PHP Email Form Validation - v3.10
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll(".php-email-form");

  forms.forEach(function (e) {
    e.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;

      // Remove action attribute to prevent default form submission
      thisForm.removeAttribute("action");
      let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

      thisForm.querySelector(".loading").classList.add("d-block");
      thisForm.querySelector(".error-message").classList.remove("d-block");
      thisForm.querySelector(".sent-message").classList.remove("d-block");

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha
                .execute(recaptcha, { action: "php_email_form_submit" })
                .then((token) => {
                  formData.set("recaptcha-response", token);
                  php_email_form_submit(thisForm, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(
            thisForm,
            "The reCaptcha javascript API url is not loaded!"
          );
        }
      } else {
        php_email_form_submit(thisForm, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, formData) {
    fetch("https://hoa-backend-production.up.railway.app/api/v1/message", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `${response.status} ${response.statusText} ${response.url}`
          );
        }
      })
      .then((data) => {
        thisForm.querySelector(".loading").classList.remove("d-block");
        if (data) {
          thisForm.querySelector(".sent-message").classList.add("d-block");
          thisForm.reset();
        } else {
          throw new Error(
            "Form submission failed and no error message returned from the server."
          );
        }
      })
      .catch((error) => {
        displayError(thisForm, error.message);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector(".loading").classList.remove("d-block");
    thisForm.querySelector(".error-message").innerHTML = error;
    thisForm.querySelector(".error-message").classList.add("d-block");
  }
})();
