// components/NotificationStack.jsx equivalent — Bootstrap toasts, timed/dismissed
// by the Store (so we render plain toast markup rather than the Bootstrap JS timer).
const NotificationStack = (() => {
  const toneIcon = { success: "bi-check-circle-fill", info: "bi-info-circle-fill", danger: "bi-exclamation-triangle-fill" };

  function render() {
    const root = document.getElementById("toast-root");
    root.innerHTML = "";
    Store.state.ui.toasts.forEach((toast) => {
      root.appendChild(
        Utils.el("div", { class: `toast show align-items-center text-bg-${toast.tone === "success" ? "success" : toast.tone === "danger" ? "danger" : "info"} border-0 mb-2`, role: "status" }, [
          Utils.el("div", { class: "d-flex" }, [
            Utils.el("div", { class: "toast-body d-flex align-items-center gap-2" }, [
              Utils.el("i", { class: `bi ${toneIcon[toast.tone] || toneIcon.info}` }),
              Utils.el("span", {}, toast.message),
            ]),
            Utils.el("button", {
              type: "button",
              class: "btn-close btn-close-white me-2 m-auto",
              "aria-label": "Dismiss notification",
              onClick: () => Store.dismissToast(toast.id),
            }),
          ]),
        ])
      );
    });
  }

  Store.subscribe(render);
  return { render };
})();
