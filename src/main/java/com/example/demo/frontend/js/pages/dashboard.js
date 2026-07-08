// Combines StatCards.jsx, DomainChart.jsx and RecentActivity.jsx from the SRS.
const DashboardPage = {
  chartInstance: null,

  async render(root) {
    root.appendChild(Utils.el("div", { class: "page-container" }, [
      Utils.el("div", { class: "page-header mb-4" }, [
        Utils.el("h1", { class: "page-title" }, "Fleet Overview"),
        Utils.el("p", { class: "page-subtitle text-body-secondary" }, "A single bearing on your vessels, voyages and cargo."),
      ]),
      Utils.el("div", { class: "row g-3 mb-4", id: "stat-cards-container" }, [
        Utils.el("div", { class: "col-12" }, Utils.el("p", { class: "text-body-secondary" }, "Loading fleet data…")),
      ]),
      Utils.el("div", { class: "row g-3" }, [
        Utils.el("div", { class: "col-12 col-lg-7" }, Utils.el("div", { class: "card h-100" }, [
          Utils.el("div", { class: "card-body" }, [
            Utils.el("h2", { class: "card-title h5" }, "Fleet Composition"),
            Utils.el("div", { class: "bar-chart", id: "bar-chart" }, [
              Utils.el("canvas", { id: "domain-chart-canvas", height: "220" }),
            ]),
          ]),
        ])),
        Utils.el("div", { class: "col-12 col-lg-5" }, Utils.el("div", { class: "card h-100", id: "recent-activity" }, [
          Utils.el("div", { class: "card-body" }, [
            Utils.el("h2", { class: "card-title h5" }, "Recent Activity"),
            Utils.el("p", { class: "text-body-secondary" }, "Loading…"),
          ]),
        ])),
      ]),
    ]));

    try {
      const [vesselsPage, voyages] = await Promise.all([
        Api.vesselService.list(0, 100),
        Api.voyageService.list(),
      ]);
      const vessels = vesselsPage.content || [];
      this.renderStatCards(vessels, voyages);
      this.renderDomainChart(vessels);
      this.renderRecentActivity(vessels, voyages);
    } catch (_) {
      const container = document.getElementById("stat-cards-container");
      container.innerHTML = "";
      container.appendChild(
        Utils.el("div", { class: "col-12" }, Utils.el("p", { class: "text-body-secondary" }, "Unable to load dashboard metrics right now."))
      );
    }
  },

  renderStatCards(vessels, voyages) {
    const container = document.getElementById("stat-cards-container");
    container.innerHTML = "";

    const totalVessels = vessels.length;
    const activeVoyages = voyages.filter((v) => v.status === "IN_TRANSIT" || v.status === "PLANNED").length;
    const fleetTonnage = vessels.reduce((sum, v) => sum + (v.deadweightTonnage || 0), 0);
    const atSea = vessels.filter((v) => v.status === "AT_SEA").length;

    const cards = [
      { label: "Total Vessels", value: totalVessels, trend: `${atSea} at sea`, icon: "bi-water" },
      { label: "Active Voyages", value: activeVoyages, trend: `${voyages.length} logged total`, icon: "bi-compass" },
      { label: "Fleet Tonnage", value: `${fleetTonnage.toLocaleString()} T`, trend: "deadweight capacity", icon: "bi-stack" },
      { label: "Port Calls", value: new Set(voyages.map((v) => v.originPort && v.originPort.id)).size, trend: "distinct origins", icon: "bi-anchor" },
    ];

    cards.forEach((card) => {
      container.appendChild(
        Utils.el("div", { class: "col-6 col-lg-3" }, Utils.el("div", { class: "stat-card card h-100" }, [
          Utils.el("div", { class: "card-body" }, [
            Utils.el("div", { class: "d-flex align-items-center justify-content-between mb-1" }, [
              Utils.el("span", { class: "stat-card-label text-body-secondary small text-uppercase" }, card.label),
              Utils.el("i", { class: `bi ${card.icon} text-body-secondary` }),
            ]),
            Utils.el("div", { class: "stat-card-value h3 mb-1" }, String(card.value)),
            Utils.el("span", { class: "stat-card-trend small text-body-secondary" }, card.trend),
          ]),
        ]))
      );
    });
  },

  renderDomainChart(vessels) {
    const counts = { CONTAINER: 0, TANKER: 0, BULK_CARRIER: 0 };
    vessels.forEach((v) => {
      if (counts[v.vesselType] !== undefined) counts[v.vesselType] += 1;
    });

    const ctx = document.getElementById("domain-chart-canvas");
    if (!ctx || typeof Chart === "undefined") return;
    if (this.chartInstance) this.chartInstance.destroy();

    this.chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(counts).map(Utils.titleCase),
        datasets: [{
          label: "Vessels",
          data: Object.values(counts),
          backgroundColor: ["#c99a4b", "#5f8fae", "#7a9e7e"],
          borderRadius: 6,
          maxBarThickness: 56,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0, color: "#93a5b8" }, grid: { color: "rgba(147,165,184,0.12)" } },
          x: { ticks: { color: "#93a5b8" }, grid: { display: false } },
        },
      },
    });
  },

  renderRecentActivity(vessels, voyages) {
    const container = document.getElementById("recent-activity");
    container.innerHTML = "";
    const body = Utils.el("div", { class: "card-body" });
    container.appendChild(body);
    body.appendChild(Utils.el("h2", { class: "card-title h5" }, "Recent Activity"));

    const vesselEvents = [...vessels]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3)
      .map((v) => ({ text: `Vessel registered — ${v.name} (${v.imoNumber})`, tag: Utils.titleCase(v.status), status: v.status }));

    const voyageEvents = [...voyages]
      .sort((a, b) => b.id - a.id)
      .slice(0, 2)
      .map((v) => ({
        text: `Voyage ${v.status === "COMPLETED" ? "completed" : "scheduled"} — ${v.originPort?.portCode || "?"} → ${v.destinationPort?.portCode || "?"}`,
        tag: Utils.titleCase(v.status),
        status: v.status,
      }));

    const events = [...vesselEvents, ...voyageEvents].slice(0, 5);

    if (events.length === 0) {
      body.appendChild(EmptyState.render({ message: "No activity yet. Register a vessel to get started.", actionLabel: "Register First Vessel", onAction: () => Router.navigate("/vessels") }));
      return;
    }

    body.appendChild(
      Utils.el("ul", { class: "activity-list list-unstyled mb-0" }, events.map((event) =>
        Utils.el("li", { class: "activity-item d-flex align-items-center gap-2 py-2" }, [
          Utils.el("span", { class: "activity-dot" }),
          Utils.el("span", { class: "activity-text flex-grow-1 small" }, event.text),
          Utils.el("span", { class: `badge text-bg-${Utils.statusTone(event.status)}` }, event.tag),
        ])
      ))
    );
  },
};
