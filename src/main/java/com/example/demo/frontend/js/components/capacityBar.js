// components/common/CapacityBar.jsx equivalent — deadweight tonnage utilization,
// rendered as a Bootstrap progress bar that shifts from brass/green toward
// warning red as utilization climbs.
const CapacityBar = {
  render(usedTons, capacityTons) {
    const pct = capacityTons > 0 ? Math.min(100, Math.round((usedTons / capacityTons) * 100)) : 0;
    let tone = "success";
    if (pct >= 85) tone = "danger";
    else if (pct >= 55) tone = "warning";

    return Utils.el("div", { class: "capacity-bar", title: `${usedTons} / ${capacityTons} T` }, [
      Utils.el("div", { class: "progress", role: "progressbar", "aria-valuenow": String(pct), "aria-valuemin": "0", "aria-valuemax": "100" }, [
        Utils.el("div", { class: `progress-bar bg-${tone}`, style: `width:${pct}%` }),
      ]),
      Utils.el("span", { class: "capacity-bar-label small text-body-secondary" }, `${pct}%`),
    ]);
  },
};
