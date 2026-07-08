// Minimal hash router — enough for a single-page app without a build step.
const Router = (() => {
  const routes = [];
  const appRoot = () => document.getElementById("app");

  function register(pattern, handler, { public: isPublic = false } = {}) {
    const paramNames = [];
    const regex = new RegExp(
      "^" +
        pattern.replace(/:[^/]+/g, (match) => {
          paramNames.push(match.slice(1));
          return "([^/]+)";
        }) +
        "$"
    );
    routes.push({ regex, paramNames, handler, public: isPublic });
  }

  function currentPath() {
    const hash = window.location.hash.replace(/^#/, "");
    return hash || "/dashboard";
  }

  function navigate(path) {
    window.location.hash = path;
  }

  async function resolve() {
    const path = currentPath();
    const match = routes.find((r) => r.regex.test(path));

    if (!match) {
      navigate(Store.isAuthenticated() ? "/dashboard" : "/login");
      return;
    }

    if (!match.public && !Store.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (match.public && Store.isAuthenticated() && (path === "/login" || path === "/register")) {
      navigate("/dashboard");
      return;
    }

    const values = match.regex.exec(path).slice(1);
    const params = {};
    match.paramNames.forEach((name, i) => (params[name] = values[i]));

    Store.clearError();
    const root = appRoot();
    root.innerHTML = "";
    root.setAttribute("aria-busy", "true");
    await match.handler(root, params);
    root.setAttribute("aria-busy", "false");

    Navbar.render();
  }

  function init() {
    window.addEventListener("hashchange", resolve);
    resolve();
  }

  return { register, navigate, init, currentPath };
})();
