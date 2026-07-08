// components/common/EmptyState.jsx equivalent
const EmptyState = {
  render({ message = "No vessels found in the registry.", actionLabel = "Register First Vessel", onAction } = {}) {
    return Utils.el("div", { class: "empty-state text-center py-5" }, [
      Utils.el("div", { class: "empty-state-glyph mb-2" }, "⚓"),
      Utils.el("p", { class: "text-body-secondary mb-3" }, message),
      onAction ? Utils.el("button", { class: "btn btn-primary", onClick: onAction }, actionLabel) : null,
    ]);
  },
};
