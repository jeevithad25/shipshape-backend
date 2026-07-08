// Wires the router to each page module and boots the app.
(function bootstrap() {
  Router.register("/login", (root) => LoginPage.render(root), { public: true });
  Router.register("/register", (root) => RegisterPage.render(root), { public: true });
  Router.register("/dashboard", (root) => DashboardPage.render(root));
  Router.register("/vessels", (root) => VesselsPage.render(root));
  Router.register("/voyages", (root) => VoyagesPage.render(root));
  Router.register("/cargo/:voyageId", (root, params) => CargoPage.render(root, params));
  Router.register("/ports", (root) => PortsPage.render(root));

  ErrorBanner.render();
  NotificationStack.render();
  Navbar.render();
  Router.init();
})();
