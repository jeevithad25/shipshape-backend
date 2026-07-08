// Registration entry point (RegisterDto: username, password, email, role)
const RegisterPage = {
  async render(root) {
    const roles = ["PORT_AUTHORITY", "VESSEL_CAPTAIN", "LOGISTICS_COORDINATOR", "SYSTEM_ADMIN"];

    const usernameInput = Utils.el("input", { type: "text", id: "reg-username", class: "form-control", placeholder: "Enter username", required: true });
    const emailInput = Utils.el("input", { type: "email", id: "reg-email", class: "form-control", placeholder: "you@shipshape.com", required: true });
    const passwordInput = Utils.el("input", { type: "password", id: "reg-password", class: "form-control", placeholder: "Enter password", required: true, minlength: 6 });
    const roleSelect = Utils.el("select", { id: "reg-role", class: "form-select", required: true }, [
      Utils.el("option", { value: "", disabled: true, selected: true }, "Select operational role"),
      ...roles.map((role) => Utils.el("option", { value: role }, Utils.titleCase(role))),
    ]);

    const submitBtn = Utils.el("button", { type: "submit", class: "btn btn-primary w-100 mt-2" }, "Create account");

    const form = Utils.el(
      "form",
      {
        class: "auth-form",
        onSubmit: async (e) => {
          e.preventDefault();
          submitBtn.textContent = "Creating…";
          submitBtn.setAttribute("disabled", "true");
          try {
            const result = await Api.authService.register({
              username: usernameInput.value.trim(),
              email: emailInput.value.trim(),
              password: passwordInput.value,
              role: roleSelect.value,
            });
            Store.loginSuccess(result);
            Store.pushToast("Account created. Welcome to ShipShape.", "success");
            Router.navigate("/dashboard");
          } catch (_) {
            /* handled by ErrorBanner */
          } finally {
            submitBtn.textContent = "Create account";
            submitBtn.removeAttribute("disabled");
          }
        },
      },
      [
        Utils.el("label", { for: "reg-username", class: "form-label" }, "Username"),
        usernameInput,
        Utils.el("label", { for: "reg-email", class: "form-label mt-3" }, "Email"),
        emailInput,
        Utils.el("label", { for: "reg-password", class: "form-label mt-3" }, "Password"),
        passwordInput,
        Utils.el("label", { for: "reg-role", class: "form-label mt-3" }, "Role"),
        roleSelect,
        submitBtn,
      ]
    );

    root.appendChild(
      Utils.el("div", { class: "login-container d-flex justify-content-center" }, [
        Utils.el("div", { class: "auth-card card shadow-lg" }, [
          Utils.el("div", { class: "card-body p-4 p-md-5" }, [
            Utils.el("div", { class: "auth-mark text-center mb-2" }, "⚓"),
            Utils.el("h1", { class: "auth-title text-center" }, "Join the Crew"),
            Utils.el("p", { class: "auth-subtitle text-center text-body-secondary mb-4" }, "Register to manage vessels, voyages and cargo."),
            form,
            Utils.el("p", { class: "auth-switch text-center mt-3 mb-0" }, [
              "Already registered? ",
              Utils.el("a", { href: "#/login" }, "Sign in"),
            ]),
          ]),
        ]),
      ])
    );
  },
};
