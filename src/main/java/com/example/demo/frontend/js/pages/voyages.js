// components/voyages/VoyageList.jsx + VoyageForm.jsx equivalent
const VoyagesPage = {
  async render(root) {
    this.root = root;

    root.appendChild(
      Utils.el("div", { class: "page-container" }, [
        Utils.el("div", { class: "page-header d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3" }, [
          Utils.el("div", {}, [
            Utils.el("h1", { class: "page-title" }, "Planned Voyages"),
            Utils.el("p", { class: "page-subtitle text-body-secondary" }, "Scheduled and active movements across the fleet."),
          ]),
          Utils.el("button", { class: "btn btn-primary d-flex align-items-center gap-1", onClick: () => this.openForm() }, [Utils.el("i", { class: "bi bi-plus-lg" }), "Initiate Voyage"]),
        ]),
        Utils.el("div", { class: "card" }, Utils.el("div", { class: "card-body" }, [
          Utils.el("div", { id: "voyage-list-slot" }, [Utils.el("p", { class: "text-body-secondary mb-0" }, "Loading voyages…")]),
        ])),
      ])
    );

    await this.load();
  },

  async load() {
    const slot = document.getElementById("voyage-list-slot");
    slot.innerHTML = "";
    try {
      const voyages = await Api.voyageService.list();
      this.renderList(voyages);
    } catch (_) {
      slot.appendChild(Utils.el("p", { class: "text-body-secondary mb-0" }, "Voyage data is unavailable right now."));
    }
  },

  renderList(voyages) {
    const slot = document.getElementById("voyage-list-slot");
    slot.innerHTML = "";

    if (voyages.length === 0) {
      slot.appendChild(EmptyState.render({ message: "No voyages have been scheduled yet.", actionLabel: "Initiate Voyage", onAction: () => this.openForm() }));
      return;
    }

    const sorted = [...voyages].sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));

    slot.appendChild(
      Utils.el("ul", { class: "voyage-list list-unstyled mb-0" }, sorted.map((voyage) =>
        Utils.el("li", { class: "voyage-row d-flex flex-wrap align-items-center gap-3 py-3" }, [
          Utils.el("div", { class: "voyage-route d-flex align-items-center gap-2 font-monospace" }, [
            Utils.el("span", { class: "voyage-port badge text-bg-secondary" }, voyage.originPort?.portCode || "—"),
            Utils.el("i", { class: "bi bi-arrow-right text-body-secondary" }),
            Utils.el("span", { class: "voyage-port badge text-bg-secondary" }, voyage.destinationPort?.portCode || "—"),
          ]),
          Utils.el("div", { class: "voyage-meta flex-grow-1" }, [
            Utils.el("div", { class: "voyage-vessel fw-semibold" }, voyage.vessel?.name || "Unknown vessel"),
            Utils.el("div", { class: "voyage-date small text-body-secondary" }, Utils.formatDate(voyage.departureDate)),
          ]),
          Utils.el("span", { class: `badge text-bg-${Utils.statusTone(voyage.status)}` }, Utils.titleCase(voyage.status)),
          Utils.el("a", { class: "btn btn-outline-light btn-sm", href: `#/cargo/${voyage.id}` }, "View Manifest"),
        ])
      ))
    );
  },

  async openForm() {
    let vessels = [];
    let ports = [];
    try {
      const [vesselsPage, portsList] = await Promise.all([Api.vesselService.list(0, 200), Api.portService.list()]);
      vessels = vesselsPage.content || [];
      ports = portsList || [];
    } catch (_) {
      return;
    }

    const vesselSelect = Utils.el("select", { id: "voyage-vessel", class: "form-select", required: true }, [
      Utils.el("option", { value: "", disabled: true, selected: true }, "Select vessel"),
      ...vessels.map((v) => Utils.el("option", { value: v.id }, `${v.name} (${v.imoNumber})`)),
    ]);

    const originSelect = Utils.el("select", { id: "voyage-origin", class: "form-select", required: true }, [
      Utils.el("option", { value: "", disabled: true, selected: true }, "Select origin port"),
      ...ports.map((p) => Utils.el("option", { value: p.id }, `${p.name} (${p.portCode})`)),
    ]);

    const destinationSelect = Utils.el("select", { id: "voyage-destination", class: "form-select", required: true }, [
      Utils.el("option", { value: "", disabled: true, selected: true }, "Select destination port"),
      ...ports.map((p) => Utils.el("option", { value: p.id }, `${p.name} (${p.portCode})`)),
    ]);

    let departureValue = Utils.toDatetimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const departureInput = Utils.el("input", {
      type: "datetime-local",
      id: "voyage-departure",
      class: "form-control",
      required: true,
      value: departureValue,
      onChange: (e) => { departureValue = e.target.value; },
    });
    departureInput.value = departureValue;

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-3" }, "Initiate Voyage");

    const form = Utils.el("form", {
      class: "modal-form",
      onSubmit: async (e) => {
        e.preventDefault();
        submitBtn.setAttribute("disabled", "true");
        try {
          await Api.voyageService.create({
            vesselId: Number(vesselSelect.value),
            originPortId: Number(originSelect.value),
            destinationPortId: Number(destinationSelect.value),
            departureDate: departureInput.value,
          });
          Store.pushToast("Voyage initiated successfully.", "success");
          modal.close();
          this.load();
        } catch (_) {
          submitBtn.removeAttribute("disabled");
        }
      },
    }, [
      Utils.el("label", { for: "voyage-vessel", class: "form-label" }, "Vessel"),
      vesselSelect,
      Utils.el("label", { for: "voyage-origin", class: "form-label mt-2" }, "Origin Port"),
      originSelect,
      Utils.el("label", { for: "voyage-destination", class: "form-label mt-2" }, "Destination Port"),
      destinationSelect,
      Utils.el("label", { for: "voyage-departure", class: "form-label mt-2" }, "Departure Date"),
      departureInput,
      submitBtn,
    ]);

    const modal = Utils.modal({ title: "Initiate Voyage", body: form });
    modal.show();
  },
};
