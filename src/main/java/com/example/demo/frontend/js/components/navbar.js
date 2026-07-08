// components/layout/Navbar.jsx equivalent — Bootstrap navbar.
const Navbar = (() => {
  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/vessels", label: "Vessels", icon: "bi-water" },
    { path: "/voyages", label: "Voyages", icon: "bi-compass" },
    { path: "/ports", label: "Ports", icon: "bi-anchor" },
  ];

  function render() {
    const root = document.getElementById("navbar-root");
    root.innerHTML = "";
    const authed = Store.isAuthenticated();
    const current = Router.currentPath();

    const brand = Utils.el("a", { class: "navbar-brand d-flex align-items-center gap-2 fw-semibold", href: "#/dashboard" }, [
      Utils.el("span", { class: "nav-brand-mark" }, "⚓"),
      Utils.el("span", {}, "ShipShape"),
    ]);

    const navLinks = authed
      ? Utils.el("ul", { class: "navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1" }, links.map((link) =>
          Utils.el("li", { class: "nav-item" }, [
            Utils.el("a", {
              href: `#${link.path}`,
              class: `nav-link d-flex align-items-center gap-2${current.startsWith(link.path) ? " active" : ""}`,
            }, [Utils.el("i", { class: `bi ${link.icon}` }), link.label]),
          ])
        ))
      : Utils.el("div", { class: "me-auto" });

    const rightSide = authed
      ? Utils.el("div", { class: "d-flex align-items-center gap-3" }, [
          Utils.el("div", { class: "text-end d-none d-sm-block" }, [
            Utils.el("div", { class: "small text-body-secondary" }, "Welcome back!"),
            Utils.el("div", { class: "fw-semibold small" }, `${Store.state.auth.username} · ${Utils.titleCase(Store.state.auth.role)}`),
          ]),
          Utils.el("button", {
            class: "btn btn-outline-light btn-sm d-flex align-items-center gap-1",
            onClick: () => {
              Store.logout();
              Router.navigate("/login");
              Store.pushToast("Signed out. Fair winds.", "info");
            },
          }, [Utils.el("i", { class: "bi bi-box-arrow-right" }), "Sign out"]),
        ])
      : Utils.el("a", { class: "btn btn-primary", href: "#/login" }, "Sign in");

    root.appendChild(
      Utils.el("nav", { class: "navbar navbar-expand-lg sticky-top" }, [
        Utils.el("div", { class: "container-xxl" }, [
          brand,
          Utils.el("button", {
            class: "navbar-toggler", type: "button",
            "data-bs-toggle": "collapse", "data-bs-target": "#navbarContent",
            "aria-controls": "navbarContent", "aria-label": "Toggle navigation",
          }, Utils.el("span", { class: "navbar-toggler-icon" })),
          Utils.el("div", { class: "collapse navbar-collapse", id: "navbarContent" }, [navLinks, rightSide]),
        ]),
      ])
    );
  }

  Store.subscribe(render);
  return { render };
})();
