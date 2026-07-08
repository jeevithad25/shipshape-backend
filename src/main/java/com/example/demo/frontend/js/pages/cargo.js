// components/cargo/CargoList.jsx + CargoForm.jsx equivalent
const CargoPage = {
  async render(root, params) {
    this.voyageId = Number(params.voyageId);
    this.root = root;

    root.appendChild(
      Utils.el("div", { class: "page-container" }, [
        Utils.el("a", { href: "#/voyages", class: "back-link d-inline-flex align-items-center gap-1 mb-3" }, [Utils.el("i", { class: "bi bi-arrow-left" }), "Back to voyages"]),
        Utils.el("div", { class: "page-header d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3" }, [
          Utils.el("div", {}, [
            Utils.el("h1", { class: "page-title" }, "Cargo Manifest"),
            Utils.el("p", { class: "page-subtitle text-body-secondary", id: "voyage-context" }, "Loading voyage details…"),
          ]),
          Utils.el("button", { class: "btn btn-primary d-flex align-items-center gap-1", onClick: () => this.openForm() }, [Utils.el("i", { class: "bi bi-plus-lg" }), "Add Cargo"]),
        ]),
        Utils.el("div", { class: "card" }, Utils.el("div", { class: "card-body" }, [
          Utils.el("div", { id: "cargo-list-slot" }, [Utils.el("p", { class: "text-body-secondary mb-0" }, "Loading manifest…")]),
        ])),
      ])
    );

    await Promise.all([this.loadVoyage(), this.load()]);
  },

  async loadVoyage() {
    try {
      const voyage = await Api.voyageService.getById(this.voyageId);
      this.voyage = voyage;
      document.getElementById("voyage-context").textContent =
        `${voyage.vessel?.name || "Vessel"} · ${voyage.originPort?.portCode || "?"} → ${voyage.destinationPort?.portCode || "?"} · ${Utils.formatDate(voyage.departureDate)}`;
    } catch (_) {
      const contextEl = document.getElementById("voyage-context");
      if (contextEl) contextEl.textContent = "Voyage details unavailable.";
    }
  },

  async load() {
    const slot = document.getElementById("cargo-list-slot");
    slot.innerHTML = "";
    try {
      const items = await Api.cargoService.byVoyage(this.voyageId);
      this.renderList(items);
    } catch (_) {
      slot.appendChild(Utils.el("p", { class: "text-body-secondary mb-0" }, "Manifest data is unavailable right now."));
    }
  },

  renderList(items) {
    const slot = document.getElementById("cargo-list-slot");
    slot.innerHTML = "";

    if (items.length === 0) {
      slot.appendChild(EmptyState.render({ message: "No cargo recorded for this voyage yet.", actionLabel: "Add First Cargo Entry", onAction: () => this.openForm() }));
      return;
    }

    const rows = items.map((cargo) =>
      Utils.el("tr", {}, [
        Utils.el("td", {}, cargo.description),
        Utils.el("td", {}, `${cargo.weightTons} T`),
        Utils.el("td", {}, Utils.titleCase(cargo.cargoType)),
        Utils.el("td", {}, Utils.el("span", { class: `badge text-bg-${Utils.statusTone(cargo.status)}` }, Utils.titleCase(cargo.status))),
        Utils.el("td", { class: "text-end" }, [
          Utils.el("button", { class: "btn btn-outline-danger btn-sm", onClick: () => this.handleDelete(cargo) }, "Delete"),
        ]),
      ])
    );

    slot.appendChild(
      Utils.el("div", { class: "table-responsive" }, Utils.el("table", { class: "table table-dark table-hover align-middle mb-0", role: "table" }, [
        Utils.el("thead", {}, Utils.el("tr", {}, [
          Utils.el("th", {}, "Description"),
          Utils.el("th", {}, "Weight"),
          Utils.el("th", {}, "Type"),
          Utils.el("th", {}, "Status"),
          Utils.el("th", { class: "text-end" }, "Actions"),
        ])),
        Utils.el("tbody", {}, rows),
      ]))
    );
  },

  async handleDelete(cargo) {
    const confirmed = window.confirm(`Remove cargo entry "${cargo.description}"?`);
    if (!confirmed) return;
    try {
      await Api.cargoService.remove(cargo.id);
      Store.pushToast("Cargo deleted successfully.", "success");
      this.load();
    } catch (_) { /* handled by ErrorBanner */ }
  },

  openForm() {
    const descriptionInput = Utils.el("input", { type: "text", class: "form-control", placeholder: "e.g. 500x Electronics Containers", required: true });
    const weightInput = Utils.el("input", { type: "number", class: "form-control", placeholder: "e.g. 120", min: "0.1", step: "any", required: true });
    const typeSelect = Utils.el("select", { class: "form-select" }, ["GENERAL", "HAZARDOUS", "REFRIGERATED"].map((t) => Utils.el("option", { value: t }, Utils.titleCase(t))));
    const statusSelect = Utils.el("select", { class: "form-select" }, ["PENDING", "LOADED", "IN_TRANSIT", "DELIVERED"].map((s) => Utils.el("option", { value: s }, Utils.titleCase(s))));

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-3" }, "Add Cargo");

    const form = Utils.el("form", {
      class: "modal-form",
      onSubmit: async (e) => {
        e.preventDefault();
        submitBtn.setAttribute("disabled", "true");
        try {
          await Api.cargoService.create({
            voyage: { id: this.voyageId },
            description: descriptionInput.value.trim(),
            weightTons: Number(weightInput.value),
            cargoType: typeSelect.value,
            status: statusSelect.value,
          });
          Store.pushToast("Cargo added to manifest.", "success");
          modal.close();
          this.load();
        } catch (_) {
          submitBtn.removeAttribute("disabled");
        }
      },
    }, [
      Utils.el("label", { class: "form-label" }, "Description"),
      descriptionInput,
      Utils.el("label", { class: "form-label mt-2" }, "Weight (metric tons)"),
      weightInput,
      Utils.el("label", { class: "form-label mt-2" }, "Cargo Type"),
      typeSelect,
      Utils.el("label", { class: "form-label mt-2" }, "Status"),
      statusSelect,
      submitBtn,
    ]);

    const modal = Utils.modal({ title: "Add Cargo Entry", body: form });
    modal.show();
  },
};
