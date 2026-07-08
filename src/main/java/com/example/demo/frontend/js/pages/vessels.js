// components/vessels/VesselList.jsx + VesselForm.jsx equivalent
const VesselsPage = {
  page: 0,
  pageSize: 8,
  searchTerm: "",
  statusFilter: "",

  async render(root) {
    this.root = root;
    this.page = 0;
    this.searchTerm = "";
    this.statusFilter = "";

    root.appendChild(
      Utils.el("div", { class: "page-container" }, [
        Utils.el("div", { class: "page-header d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3" }, [
          Utils.el("div", {}, [
            Utils.el("h1", { class: "page-title" }, "Maritime Fleet"),
            Utils.el("p", { class: "page-subtitle text-body-secondary" }, "Registry of vessels under ShipShape management."),
          ]),
          Store.isAdmin()
            ? Utils.el("button", { class: "btn btn-primary d-flex align-items-center gap-1", onClick: () => this.openForm() }, [Utils.el("i", { class: "bi bi-plus-lg" }), "Register Vessel"])
            : null,
        ]),
        Utils.el("div", { id: "vessel-filter-slot" }),
        Utils.el("div", { class: "card" }, Utils.el("div", { class: "card-body" }, [
          Utils.el("div", { id: "vessel-table-slot" }, [Utils.el("p", { class: "text-body-secondary mb-0" }, "Loading fleet data.")]),
        ])),
        Utils.el("nav", { class: "d-flex justify-content-center mt-3" }, Utils.el("ul", { class: "pagination mb-0", id: "vessel-pagination" })),
      ])
    );

    document.getElementById("vessel-filter-slot").appendChild(
      SearchFilterBar.render({
        statusOptions: ["UNDER_MAINTENANCE", "MOORED", "AT_SEA"],
        onSearch: (value) => { this.searchTerm = value.toLowerCase(); this.load(); },
        onFilter: (value) => { this.statusFilter = value; this.load(); },
      })
    );

    await this.load();
  },

  async load() {
    const tableSlot = document.getElementById("vessel-table-slot");
    tableSlot.innerHTML = "";
    tableSlot.appendChild(Utils.el("p", { class: "text-body-secondary mb-0" }, "Loading fleet data."));

    try {
      const result = await Api.vesselService.list(this.page, this.pageSize);
      let items = result.content || [];
      if (this.searchTerm) {
        items = items.filter((v) => v.name.toLowerCase().includes(this.searchTerm) || v.imoNumber.toLowerCase().includes(this.searchTerm));
      }
      if (this.statusFilter) {
        items = items.filter((v) => v.status === this.statusFilter);
      }
      this.renderTable(items);
      this.renderPagination(result.totalPages || 1);
    } catch (_) {
      tableSlot.innerHTML = "";
      tableSlot.appendChild(Utils.el("p", { class: "text-body-secondary mb-0" }, "Fleet data is unavailable right now."));
    }
  },

  renderTable(items) {
    const tableSlot = document.getElementById("vessel-table-slot");
    tableSlot.innerHTML = "";

    if (items.length === 0) {
      tableSlot.appendChild(
        EmptyState.render({
          message: "No vessels found in the registry.",
          actionLabel: "Register First Vessel",
          onAction: Store.isAdmin() ? () => this.openForm() : undefined,
        })
      );
      return;
    }

    const rows = items.map((vessel) =>
      Utils.el("tr", {}, [
        Utils.el("td", {}, vessel.name),
        Utils.el("td", { class: "font-monospace" }, vessel.imoNumber),
        Utils.el("td", {}, Utils.titleCase(vessel.vesselType)),
        Utils.el("td", {}, `${vessel.deadweightTonnage.toLocaleString()} T`),
        Utils.el("td", {}, Utils.el("span", { class: `badge text-bg-${Utils.statusTone(vessel.status)}` }, Utils.titleCase(vessel.status))),
        Utils.el("td", { class: "text-end" }, [
          Utils.el("button", { class: "btn btn-outline-light btn-sm me-1", onClick: () => this.openForm(vessel) }, "Edit"),
          Store.isAdmin()
            ? Utils.el("button", { class: "btn btn-outline-danger btn-sm", onClick: () => this.handleDelete(vessel) }, "Delete")
            : null,
        ]),
      ])
    );

    tableSlot.appendChild(
      Utils.el("div", { class: "table-responsive" }, Utils.el("table", { class: "table table-dark table-hover align-middle mb-0", role: "table" }, [
        Utils.el("thead", {}, Utils.el("tr", {}, [
          Utils.el("th", {}, "Name"),
          Utils.el("th", {}, "IMO Number"),
          Utils.el("th", {}, "Type"),
          Utils.el("th", {}, "Tonnage"),
          Utils.el("th", {}, "Status"),
          Utils.el("th", { class: "text-end" }, "Actions"),
        ])),
        Utils.el("tbody", {}, rows),
      ]))
    );
  },

  renderPagination(totalPages) {
    const nav = document.getElementById("vessel-pagination");
    nav.innerHTML = "";
    if (totalPages <= 1) return;

    for (let i = 0; i < totalPages; i += 1) {
      nav.appendChild(
        Utils.el("li", { class: `page-item${i === this.page ? " active" : ""}` }, [
          Utils.el("a", {
            href: "#",
            class: "page-link",
            onClick: (e) => { e.preventDefault(); this.page = i; this.load(); },
          }, String(i + 1)),
        ])
      );
    }
  },

  async handleDelete(vessel) {
    const confirmed = window.confirm(`Delete vessel "${vessel.name}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await Api.vesselService.remove(vessel.id);
      Store.pushToast("Vessel deleted successfully.", "success");
      this.load();
    } catch (_) {
      /* ErrorBanner already shows the failure */
    }
  },

  openForm(existingVessel = null) {
    const isEdit = Boolean(existingVessel);

    const nameInput = Utils.el("input", {
      type: "text",
      class: "form-control",
      placeholder: "e.g. Ocean Queen",
      required: true,
      value: "",
      disabled: isEdit,
    });
    if (isEdit) nameInput.value = existingVessel.name;

    const imoInput = Utils.el("input", { type: "text", class: "form-control", placeholder: "e.g. IMO9074729", required: true, disabled: isEdit });
    if (isEdit) imoInput.value = existingVessel.imoNumber;

    const typeSelect = Utils.el("select", { class: "form-select", disabled: isEdit }, ["CONTAINER", "TANKER", "BULK_CARRIER"].map((t) =>
      Utils.el("option", { value: t, selected: isEdit ? existingVessel.vesselType === t : t === "CONTAINER" }, Utils.titleCase(t))
    ));

    const tonnageInput = Utils.el("input", { type: "number", class: "form-control", placeholder: "e.g. 45000", min: "1", step: "any", required: true, disabled: isEdit });
    if (isEdit) tonnageInput.value = existingVessel.deadweightTonnage;

    const statusSelect = Utils.el("select", { class: "form-select" }, ["UNDER_MAINTENANCE", "MOORED", "AT_SEA"].map((s) =>
      Utils.el("option", { value: s, selected: isEdit ? existingVessel.status === s : s === "MOORED" }, Utils.titleCase(s))
    ));

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-3" }, isEdit ? "Update Status" : "Register Vessel");

    const form = Utils.el("form", {
      class: "modal-form",
      onSubmit: async (e) => {
        e.preventDefault();
        submitBtn.setAttribute("disabled", "true");
        try {
          if (isEdit) {
            await Api.vesselService.updateStatus(existingVessel.id, statusSelect.value);
            Store.pushToast("Vessel updated successfully.", "success");
          } else {
            await Api.vesselService.create({
              name: nameInput.value.trim(),
              imoNumber: imoInput.value.trim(),
              vesselType: typeSelect.value,
              deadweightTonnage: Number(tonnageInput.value),
              status: statusSelect.value,
            });
            Store.pushToast("Vessel created successfully.", "success");
          }
          modal.close();
          this.load();
        } catch (_) {
          submitBtn.removeAttribute("disabled");
        }
      },
    }, [
      Utils.el("label", { class: "form-label" }, "Vessel Name"),
      nameInput,
      Utils.el("label", { class: "form-label mt-2" }, "IMO Number"),
      imoInput,
      Utils.el("label", { class: "form-label mt-2" }, "Vessel Type"),
      typeSelect,
      Utils.el("label", { class: "form-label mt-2" }, "Deadweight Tonnage"),
      tonnageInput,
      Utils.el("label", { class: "form-label mt-2" }, "Status"),
      statusSelect,
      isEdit ? Utils.el("p", { class: "modal-hint small text-body-secondary mt-2 mb-0" }, "Name, IMO, type and tonnage are locked after registration — only status can be updated.") : null,
      submitBtn,
    ]);

    const modal = Utils.modal({ title: isEdit ? "Update Vessel" : "Register Vessel", body: form });
    modal.show();
    nameInput.focus();
  },
};
