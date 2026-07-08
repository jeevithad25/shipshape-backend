// components/Login.jsx equivalent
const LoginPage = {
  async render(root) {
    let submitting = false;

    const usernameInput = Utils.el("input", {
      type: "text",
      id: "login-username",
      class: "form-control",
      placeholder: "Enter username",
      required: true,
      autocomplete: "username",
    });
    const passwordInput = Utils.el("input", {
      type: "password",
      id: "login-password",
      class: "form-control",
      placeholder: "Enter password",
      required: true,
      autocomplete: "current-password",
    });

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-2" }, "Sign in");

    const form = Utils.el(
      "form",
      {
        class: "auth-form",
        onSubmit: async (e) => {
          e.preventDefault();
          if (submitting) return;
          submitting = true;
          submitBtn.textContent = "Signing in…";
          submitBtn.setAttribute("disabled", "true");
          try {
            const result = await Api.authService.login(usernameInput.value.trim(), passwordInput.value);
            Store.loginSuccess(result);
            Store.pushToast(`Welcome aboard, ${result.username}.`, "success");
            Router.navigate("/dashboard");
          } catch (_) {
            // ErrorBanner already reflects the failure
          } finally {
            submitting = false;
            submitBtn.textContent = "Sign in";
            submitBtn.removeAttribute("disabled");
          }
        },
      },
      [
        Utils.el("label", { for: "login-username", class: "form-label" }, "Username"),
        usernameInput,
        Utils.el("label", { for: "login-password", class: "form-label mt-3" }, "Password"),
        passwordInput,
        submitBtn,
      ]
    );

    root.appendChild(
      Utils.el("div", { class: "login-container d-flex justify-content-center" }, [
        Utils.el("div", { class: "auth-card card shadow-lg" }, [
          Utils.el("div", { class: "card-body p-4 p-md-5" }, [
            Utils.el("div", { class: "auth-mark text-center mb-2" }, "⚓"),
            Utils.el("h1", { class: "auth-title text-center" }, "ShipShape Login"),
            Utils.el("p", { class: "auth-subtitle text-center text-body-secondary mb-4" }, "Chart your fleet. Sign in to continue."),
            form,
            Utils.el("p", { class: "auth-switch text-center mt-3 mb-1" }, [
              "New to ShipShape? ",
              Utils.el("a", { href: "#/register" }, "Register a crew account"),
            ]),
            Utils.el("p", { class: "auth-hint text-center small text-body-secondary" }, "Demo admin: admin / admin123"),
          ]),
        ]),
      ])
    );
  },
};
