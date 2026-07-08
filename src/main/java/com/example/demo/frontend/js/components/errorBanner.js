// components/ErrorHandler.jsx equivalent — Bootstrap alert for API failures,
// pinned above the navbar so it's impossible to miss.
const ErrorBanner = (() => {
  function render() {
    const root = document.getElementById("error-banner-root");
    root.innerHTML = "";
    const message = Store.state.ui.error;
    if (!message) return;
    root.appendChild(
      Utils.el("div", { class: "alert alert-danger rounded-0 border-0 mb-0 d-flex align-items-center justify-content-center gap-2 py-2", role: "alert" }, [
        Utils.el("i", { class: "bi bi-exclamation-octagon-fill" }),
        Utils.el("span", {}, `Error: ${message}`),
        Utils.el("button", {
          type: "button",
          class: "btn-close ms-3",
          "aria-label": "Dismiss error",
          onClick: () => Store.clearError(),
        }),
      ])
    );
  }

  Store.subscribe(render);
  return { render };
})();
