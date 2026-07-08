// Small shared helpers used across pages/components.
const Utils = (() => {

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === "class") node.className = value;
      else if (key === "html") node.innerHTML = value;
      else if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dk, dv]) => (node.dataset[dk] = dv));
      } else {
        node.setAttribute(key, value);
      }
    });
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child === undefined || child === null || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function titleCase(value) {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function toDatetimeLocalValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function debounce(fn, wait = 250) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }

  // Maps domain status values to Bootstrap contextual color suffixes
  // (used with badge/text-bg-*, btn-*, progress-bar-* etc).
  function statusTone(status) {
    const positive = ["AT_SEA", "COMPLETED", "DELIVERED", "MOORED", "LOADED"];
    const warning = ["PLANNED", "PENDING", "IN_TRANSIT"];
    const negative = ["UNDER_MAINTENANCE", "DELAYED"];
    if (positive.includes(status)) return "success";
    if (warning.includes(status)) return "warning";
    if (negative.includes(status)) return "danger";
    return "secondary";
  }

  // Builds a Bootstrap modal (modal + backdrop + JS instance) from a body node,
  // wires cleanup on hide, and returns { instance, show, close }.
  function modal({ title, body, size = "" }) {
    const closeBtn = el("button", { type: "button", class: "btn-close btn-close-white", "data-bs-dismiss": "modal", "aria-label": "Close" });

    const dialog = el("div", { class: `modal-dialog modal-dialog-centered${size ? " " + size : ""}` }, [
      el("div", { class: "modal-content" }, [
        el("div", { class: "modal-header" }, [
          el("h5", { class: "modal-title" }, title),
          closeBtn,
        ]),
        el("div", { class: "modal-body" }, body),
      ]),
    ]);

    const overlay = el("div", { class: "modal fade", tabindex: "-1" }, dialog);
    document.body.appendChild(overlay);

    const instance = new bootstrap.Modal(overlay);
    overlay.addEventListener("hidden.bs.modal", () => overlay.remove());

    return {
      element: overlay,
      show: () => instance.show(),
      close: () => instance.hide(),
    };
  }

  return { el, titleCase, formatDate, toDatetimeLocalValue, debounce, statusTone, modal };
})();
