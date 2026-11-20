// Validates enquiries and sends them to the configured Formspree endpoint.
export function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const fields = [
    form.elements.namedItem("name"),
    form.elements.namedItem("email"),
    form.elements.namedItem("phone"),
    form.elements.namedItem("message"),
  ];

  const validationMessage = (field) => {
    const value = field.value.trim();

    if (field.required && !value) {
      return "This field is required.";
    }

    if (field.name === "name" && value.length < 2) {
      return "Please enter at least two characters for your name.";
    }

    if (
      field.name === "name" &&
      !/^[\p{L}][\p{L}\p{M}\s.'’\-]*$/u.test(value)
    ) {
      return "Use letters only, with spaces, apostrophes, periods, or hyphens if needed.";
    }

    if (field.name === "email") {
      const emailPattern =
        /^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])$/i;
      if (field.validity.typeMismatch || !emailPattern.test(value)) {
        return "Enter a valid email address, such as name@example.com.";
      }
    }

    if (field.name === "phone" && value && !/^\d{10,12}$/.test(value)) {
      return "Enter 10 to 12 digits, or leave this optional field blank.";
    }

    if (field.name === "message" && value.length < 10) {
      return "Please enter an enquiry message with at least 10 characters.";
    }

    return "";
  };

  const validateField = (field) => {
    const message = validationMessage(field);
    field.setCustomValidity(message);
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
    return !message;
  };

  form.addEventListener("input", (event) => {
    if (!fields.includes(event.target)) return;

    if (event.target.name === "name") {
      event.target.value = event.target.value.replace(
        /[^\p{L}\p{M}\s.'’\-]/gu,
        "",
      ).replace(/\s+/g, " ");
    } else if (event.target.name === "phone") {
      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 15);
    }

    validateField(event.target);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = fields.map(validateField).every(Boolean);
    if (!isValid || !form.reportValidity()) {
      status.textContent =
        "Your enquiry was not sent. Correct the highlighted fields and try again.";
      status.className = "form-status error";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const honeypot = form.elements.namedItem("_gotcha");
    if (honeypot.value.trim()) {
      status.textContent =
        "We couldn't process this request. Please try again.";
      status.className = "form-status error";
      return;
    }

    fields.forEach((field) => {
      field.value = field.value.trim();
    });

    const formId = (form.dataset.formId || "").trim();
    if (!formId) {
      status.textContent =
        "Email delivery isn't configured yet. Add the Formspree form ID in contact.html before accepting enquiries.";
      status.className = "form-status error";
      return;
    }

    if (!/^[a-z0-9]+$/i.test(formId)) {
      status.textContent =
        "Email delivery could not be started. Check the Formspree form ID in contact.html.";
      status.className = "form-status error";
      return;
    }

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your enquiry…";
    status.className = "form-status";

    try {
      const response = await fetch(
        `https://formspree.io/f/${encodeURIComponent(formId)}`,
        {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        },
      );

      if (!response.ok) {
        const responseBody = await response.text();
        let detail = "";
        try {
          const errorData = JSON.parse(responseBody);
          detail = Array.isArray(errorData.errors)
            ? errorData.errors
                .map((item) => item.message)
                .filter(Boolean)
                .join(" ")
            : errorData.error || "";
        } catch (error) {
          detail = "";
        }
        status.textContent = detail
          ? `We couldn't send your enquiry: ${detail}`
          : `We couldn't send your enquiry (HTTP ${response.status}). Please try again.`;
        status.className = "form-status error";
        return;
      }

      form.reset();
      status.textContent = "Thank you. Your enquiry was sent successfully.";
      status.className = "form-status success";
    } catch (error) {
      status.textContent =
        "We couldn't send your enquiry. Check your connection and try again.";
      status.className = "form-status error";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      form.removeAttribute("aria-busy");
    }
  });
}
