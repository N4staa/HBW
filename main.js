/* =========================================================
   Hot Beans Web — site scripts
   1. Mobile navigation
   2. Course filter (courses.html)
   3. Role pre-selection + form validation (apply.html)
   4. Personalised confirmation (thank-you.html)
   ========================================================= */

document.documentElement.classList.replace("no-js", "js");

/* Applicant details are kept in sessionStorage only, so they
   disappear when the browser tab is closed. */
const STORAGE_KEY = "hbw-application";

/* ---------- 1. Mobile navigation ---------- */
function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
    nav.hidden = !open;
  }

  function syncToScreen() {
    if (mobileQuery.matches) {
      setOpen(false);
    } else {
      nav.hidden = false;
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  mobileQuery.addEventListener("change", syncToScreen);
  syncToScreen();
}

/* ---------- 2. Course filter ---------- */
function initCourseFilter() {
  const filter = document.querySelector(".filter");
  if (!filter) return;

  const buttons = filter.querySelectorAll("button");
  const courses = document.querySelectorAll(".course");
  const count = document.getElementById("course-count");

  function apply(level) {
    let shown = 0;
    courses.forEach((course) => {
      const match = level === "all" || course.dataset.level === level;
      course.hidden = !match;
      if (match) shown += 1;
    });
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.level === level));
    });
    const label = level === "all" ? "" : ` ${level}`;
    count.textContent = `Showing ${shown}${label} course${shown === 1 ? "" : "s"}`;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.level));
  });

  apply("all");
}

/* ---------- 3. Application form ---------- */
const validators = {
  firstName: (value) => (value.trim() ? "" : "Enter your first name"),
  lastName: (value) => (value.trim() ? "" : "Enter your surname"),
  email: (value) => {
    if (!value.trim()) return "Enter your email address";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? ""
      : "Enter an email address in the correct format, like name@example.com";
  },
  phone: (value) => {
    const digits = value.replace(/[\s()-]/g, "");
    if (!digits) return "Enter your phone number";
    return /^(\+44|0)\d{9,10}$/.test(digits)
      ? ""
      : "Enter a UK phone number, like 07700 900123 or +44 7700 900123";
  },
  dob: (value) => {
    if (!value) return "Enter your date of birth";
    const birth = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const birthdayPassed =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    if (!birthdayPassed) age -= 1;
    if (birth > today) return "Date of birth must be in the past";
    return age >= 16 ? "" : "You must be 16 or over to apply";
  },
  london: (value) => (value ? "" : "Select whether you live in London"),
  role: (value) => (value ? "" : "Select the role you are applying for"),
  qualifications: (value) =>
    value.trim().length >= 10 ? "" : "Tell us about your qualifications (at least 10 characters)",
  consent: (value, field) => (field.checked ? "" : "Confirm you agree to the privacy policy"),
};

function getValue(form, name) {
  const field = form.elements[name];
  if (field instanceof RadioNodeList) return field.value;
  return field.value;
}

function showError(form, name, message) {
  const wrapper = form.querySelector(`[data-field="${name}"]`);
  const errorEl = wrapper.querySelector(".error-message");
  const inputs = wrapper.querySelectorAll("input, select, textarea");

  wrapper.classList.toggle("has-error", Boolean(message));
  errorEl.textContent = message;
  inputs.forEach((input) => {
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  });
}

function validateField(form, name) {
  const field = form.elements[name];
  const message = validators[name](getValue(form, name), field);
  showError(form, name, message);
  return message;
}

function initApplicationForm() {
  const form = document.getElementById("application-form");
  if (!form) return;

  form.noValidate = true;

  // Pre-select the role when arriving from a "Apply for this role" link
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  if (requestedRole && form.elements.role.querySelector(`option[value="${requestedRole}"]`)) {
    form.elements.role.value = requestedRole;
  }

  // Once a field shows an error, re-check it while the user types, so the
  // message clears straight away rather than shifting the layout on blur.
  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    const inputs = field instanceof RadioNodeList ? Array.from(field) : [field];
    const recheck = () => {
      if (form.querySelector(`[data-field="${name}"]`).classList.contains("has-error")) {
        validateField(form, name);
      }
    };
    inputs.forEach((input) => {
      input.addEventListener("input", recheck);
      input.addEventListener("change", recheck);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = Object.keys(validators)
      .map((name) => ({ name, message: validateField(form, name) }))
      .filter((result) => result.message);

    const summary = document.getElementById("error-summary");
    const list = summary.querySelector("ul");
    list.innerHTML = "";

    if (errors.length) {
      errors.forEach(({ name, message }) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const target = form.querySelector(`[data-field="${name}"] input, [data-field="${name}"] select, [data-field="${name}"] textarea`);
        link.href = `#${target.id}`;
        link.textContent = message;
        link.addEventListener("click", (clickEvent) => {
          clickEvent.preventDefault();
          target.focus();
        });
        item.append(link);
        list.append(item);
      });
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;

    const roleSelect = form.elements.role;
    const application = {
      firstName: getValue(form, "firstName").trim(),
      email: getValue(form, "email").trim(),
      role: roleSelect.options[roleSelect.selectedIndex].text,
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(application));
    } catch (error) {
      // Storage can be blocked in private browsing; the thank-you page still works.
    }

    window.location.href = "thank-you.html";
  });
}

/* ---------- 4. Thank-you page ---------- */
function initConfirmation() {
  const heading = document.getElementById("confirmation-heading");
  if (!heading) return;

  let application = null;
  try {
    application = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  } catch (error) {
    application = null;
  }

  if (!application) return;

  heading.textContent = `Thanks, ${application.firstName}. Your application is in.`;
  document.getElementById("summary-role").textContent = application.role;
  document.getElementById("summary-email").textContent = application.email;
  document.getElementById("summary").hidden = false;
}

initNavigation();
initCourseFilter();
initApplicationForm();
initConfirmation();
