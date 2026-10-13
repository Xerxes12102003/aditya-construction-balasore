const form = document.querySelector("#booking-form");
const summary = document.querySelector("#form-summary");

if (form && summary) {
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  form.elements.date.min = today;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Enter your full name."),
    phone: (v) => (/^[6-9]\d{9}$/.test(v) ? "" : "Enter a 10-digit mobile number starting with 6, 7, 8 or 9."),
    service: (v) => (v ? "" : "Select a service."),
    date: (v) => (!v ? "Choose a preferred date." : v < today ? "Choose today or a future date." : ""),
    slot: (v) => (v ? "" : "Select a time slot."),
    consent: (_v, el) => (el.checked ? "" : "Tick the box to continue."),
  };

  let submitted = false;

  const check = (id) => {
    const el = form.elements[id];
    const error = document.querySelector(`#${id}-error`);
    const message = rules[id](el.value, el);
    error.textContent = message;
    error.hidden = !message;
    el.toggleAttribute("aria-invalid", Boolean(message));
    if (message) el.setAttribute("aria-invalid", "true");
    return message;
  };

  const renderSummary = (errors) => {
    summary.replaceChildren();
    if (!errors.length) {
      summary.hidden = true;
      return;
    }
    const lead = document.createElement("p");
    lead.textContent = `Please fix ${errors.length} ${errors.length === 1 ? "field" : "fields"}:`;
    const list = document.createElement("ul");
    errors.forEach(({ id, message }) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.textContent = message;
      li.append(a);
      list.append(li);
    });
    summary.append(lead, list);
    summary.hidden = false;
  };

  const run = () => {
    const errors = Object.keys(rules)
      .map((id) => ({ id, message: check(id) }))
      .filter((e) => e.message);
    renderSummary(errors);
    return errors;
  };

  form.elements.phone.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  });

  Object.keys(rules).forEach((id) => {
    const live = () => {
      if (submitted) run();
    };
    form.elements[id].addEventListener("input", live);
    form.elements[id].addEventListener("change", live);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitted = true;
    const errors = run();
    if (errors.length) {
      summary.focus();
      return;
    }
    form.dispatchEvent(new CustomEvent("booking:valid"));
  });
}

import { waLink } from "../../config";

if (form) {
  const fmtDate = (v) => {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  form.addEventListener("booking:valid", () => {
    const f = form.elements;
    const service = f.service.selectedOptions[0].textContent;
    const notes = f.notes.value.trim() || "None";
    const text = `Hello Aditya Construction, I'm ${f.name.value.trim()}. I'd like a consultation for ${service} on ${fmtDate(f.date.value)} at ${f.slot.value}. Phone: +91 ${f.phone.value}. Note: ${notes}`;
    const url = waLink(text);

    const old = form.querySelector("#wa-fallback");
    if (old) old.remove();

    const win = window.open(url, "_blank");
    if (win) {
      win.opener = null;
      return;
    }

    const box = document.createElement("p");
    box.id = "wa-fallback";
    box.className = "wa-fallback";
    box.setAttribute("role", "status");
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open WhatsApp";
    box.append("Your browser blocked the new tab. ", link);
    form.append(box);
  });
}
