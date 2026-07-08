// services/api.js equivalent — an Axios instance with request/response interceptors
// that automatically inject the JWT bearer token and normalize error handling
// against GlobalExceptionHandler's { "message": "..." } shape.
const Api = (() => {
  const client = axios.create({
    baseURL: window.SHIPSHAPE_CONFIG.API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor — mirrors a JWT auth interceptor: attaches the bearer
  // token from the store to every outgoing request unless explicitly opted out.
  // NOTE: we deliberately do NOT use Axios's own `auth` config key here — that
  // key is reserved for HTTP Basic Auth ({ username, password }) and Axios's
  // adapter will overwrite any Authorization header we set with a bogus
  // "Basic ..." header if `auth` is truthy but not a credentials object. We
  // use `skipAuth` instead to avoid colliding with it.
  client.interceptors.request.use((config) => {
    if (!config.skipAuth && Store.state.auth.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${Store.state.auth.token}`;
    }
    return config;
  });

  // Response interceptor — clears the global error banner on success, and on
  // failure normalizes network errors, 401s, and API error payloads into a
  // single Error the caller can catch (ErrorBanner already reflects it).
  client.interceptors.response.use(
    (response) => {
      Store.clearError();
      return response;
    },
    (error) => {
      if (!error.response) {
        const message = "Unable to reach the ShipShape server. Confirm the backend is running.";
        Store.setError(message);
        return Promise.reject(new Error(message));
      }

      const { status, data } = error.response;

      if (status === 401) {
        Store.setError("Session expired or unauthorized. Please sign in again.");
        Store.logout();
        Router.navigate("/login");
        return Promise.reject(new Error("Unauthorized"));
      }

      const message = (data && data.message) || `Request failed with status ${status}.`;
      Store.setError(message);
      return Promise.reject(new Error(message));
    }
  );

  async function request(path, { method = "GET", body, auth = true, params } = {}) {
    const cleanParams = params
      ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
      : undefined;

    const response = await client.request({
      url: path,
      method,
      data: body,
      params: cleanParams,
      skipAuth: auth === false,
    });

    // Controllers that return 204/empty bodies resolve to null; Axios already
    // parses JSON bodies, and plain-text success responses pass through as-is.
    return response.status === 204 || response.data === "" ? null : response.data;
  }

  // --- services/authService.js ---
  const authService = {
    login: (username, password) => request("/auth/login", { method: "POST", body: { username, password }, auth: false }),
    register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  };

  // --- services/vesselService.js ---
  const vesselService = {
    list: (page = 0, size = 8) => request("/vessels", { params: { page, size } }),
    getById: (id) => request(`/vessels/${id}`),
    create: (vessel) => request("/vessels", { method: "POST", body: vessel }),
    updateStatus: (id, status) => request(`/vessels/${id}/status`, { method: "PUT", body: status }),
    remove: (id) => request(`/vessels/${id}`, { method: "DELETE" }),
  };

  // --- services/voyageService.js ---
  const voyageService = {
    list: () => request("/voyages"),
    getById: (id) => request(`/voyages/${id}`),
    create: (payload) => request("/voyages", { method: "POST", body: payload }),
  };

  // --- services/cargoService.js ---
  const cargoService = {
    byVoyage: (voyageId) => request(`/cargo/voyage/${voyageId}`),
    create: (cargo) => request("/cargo", { method: "POST", body: cargo }),
    remove: (id) => request(`/cargo/${id}`, { method: "DELETE" }),
  };

  // --- services/portService.js ---
  const portService = {
    list: () => request("/ports"),
    create: (port) => request("/ports", { method: "POST", body: port }),
  };

  return { client, request, authService, vesselService, voyageService, cargoService, portService };
})();
