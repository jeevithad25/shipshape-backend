// Deep-water port registry, backed by /api/ports
const PortsPage = {
  async render(root) {
    root.appendChild(
      Utils.el("div", { class: "page-container" }, [
        Utils.el("div", { class: "page-header d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3" }, [
          Utils.el("div", {}, [
            Utils.el("h1", { class: "page-title" }, "Port Registry"),
            Utils.el("p", { class: "page-subtitle text-body-secondary" }, "Deep-water nodes available for voyage planning."),
          ]),
          Store.isAdmin()
            ? Utils.el("button", { class: "btn btn-primary d-flex align-items-center gap-1", onClick: () => this.openForm() }, [Utils.el("i", { class: "bi bi-plus-lg" }), "Add Port"])
            : null,
        ]),
        Utils.el("div", { class: "card" }, Utils.el("div", { class: "card-body" }, [
          Utils.el("div", { id: "port-list-slot" }, [Utils.el("p", { class: "text-body-secondary mb-0" }, "Loading ports…")]),
        ])),
      ])
    );

    await this.load();
  },

  async load() {
    const slot = document.getElementById("port-list-slot");
    slot.innerHTML = "";
    try {
      const ports = await Api.portService.list();
      this.renderList(ports);
    } catch (_) {
      slot.appendChild(Utils.el("p", { class: "text-body-secondary mb-0" }, "Port registry is unavailable right now."));
    }
  },

  renderList(ports) {
    const slot = document.getElementById("port-list-slot");
    slot.innerHTML = "";

    if (ports.length === 0) {
      slot.appendChild(EmptyState.render({
        message: "No ports registered yet.",
        actionLabel: "Add First Port",
        onAction: Store.isAdmin() ? () => this.openForm() : undefined,
      }));
      return;
    }

    slot.appendChild(
      Utils.el("div", { class: "table-responsive" }, Utils.el("table", { class: "table table-dark table-hover align-middle mb-0", role: "table" }, [
        Utils.el("thead", {}, Utils.el("tr", {}, [
          Utils.el("th", {}, "Port"),
          Utils.el("th", {}, "Code"),
          Utils.el("th", {}, "Country"),
        ])),
        Utils.el("tbody", {}, ports.map((port) =>
          Utils.el("tr", {}, [
            Utils.el("td", {}, port.name),
            Utils.el("td", { class: "font-monospace" }, port.portCode),
            Utils.el("td", {}, port.country),
          ])
        )),
      ]))
    );
  },

  openForm() {
    const nameInput = Utils.el("input", { type: "text", class: "form-control", placeholder: "e.g. Port of Antwerp", required: true });
    const codeInput = Utils.el("input", { type: "text", class: "form-control", placeholder: "e.g. BEANR", required: true });
    const countryInput = Utils.el("input", { type: "text", class: "form-control", placeholder: "e.g. Belgium", required: true });

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-3" }, "Add Port");

    const form = Utils.el("form", {
      class: "modal-form",
      onSubmit: async (e) => {
        e.preventDefault();
        submitBtn.setAttribute("disabled", "true");
        try {
          await Api.portService.create({
            name: nameInput.value.trim(),
            portCode: codeInput.value.trim().toUpperCase(),
            country: countryInput.value.trim(),
          });
          Store.pushToast("Port added to registry.", "success");
          modal.close();
          this.load();
        } catch (_) {
          submitBtn.removeAttribute("disabled");
        }
      },
    }, [
      Utils.el("label", { class: "form-label" }, "Port Name"),
      nameInput,
      Utils.el("label", { class: "form-label mt-2" }, "Port Code"),
      codeInput,
      Utils.el("label", { class: "form-label mt-2" }, "Country"),
      countryInput,
      submitBtn,
    ]);

    const modal = Utils.modal({ title: "Add Port", body: form });
    modal.show();
  },
};
