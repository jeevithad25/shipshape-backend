// Lightweight global store standing in for Redux Toolkit slices described in the SRS
// (authSlice, vesselSlice, voyageSlice, cargoSlice, portSlice) — same responsibilities,
// implemented with a tiny pub-sub since this build is plain HTML/CSS/JS.
const Store = (() => {
  const listeners = new Set();

  const state = {
    auth: {
      token: localStorage.getItem("shipshape_token") || null,
      username: localStorage.getItem("shipshape_username") || null,
      role: localStorage.getItem("shipshape_role") || null,
    },
    vessels: { items: [], totalPages: 1, page: 0, loading: false },
    voyages: { items: [], loading: false },
    cargo: { items: [], voyageId: null, loading: false },
    ports: { items: [], loading: false },
    ui: { error: null, toasts: [] },
  };

  function notify() {
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // --- auth slice ---
  function loginSuccess({ token, username, role }) {
    state.auth = { token, username, role };
    localStorage.setItem("shipshape_token", token);
    localStorage.setItem("shipshape_username", username);
    localStorage.setItem("shipshape_role", role);
    notify();
  }

  function logout() {
    state.auth = { token: null, username: null, role: null };
    localStorage.removeItem("shipshape_token");
    localStorage.removeItem("shipshape_username");
    localStorage.removeItem("shipshape_role");
    notify();
  }

  function isAuthenticated() {
    return Boolean(state.auth.token);
  }

  function isAdmin() {
    return state.auth.role === "SYSTEM_ADMIN";
  }

  // --- ui slice ---
  function setError(message) {
    state.ui.error = message;
    notify();
  }

  function clearError() {
    state.ui.error = null;
    notify();
  }

  function pushToast(message, tone = "success") {
    const id = `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.ui.toasts = [...state.ui.toasts, { id, message, tone }];
    notify();
    setTimeout(() => dismissToast(id), 3500);
  }

  function dismissToast(id) {
    state.ui.toasts = state.ui.toasts.filter((t) => t.id !== id);
    notify();
  }

  return {
    state,
    subscribe,
    loginSuccess,
    logout,
    isAuthenticated,
    isAdmin,
    setError,
    clearError,
    pushToast,
    dismissToast,
  };
})();
