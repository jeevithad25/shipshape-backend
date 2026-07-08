# ShipShape — Frontend (HTML / CSS / Bootstrap / JS / Axios)

A dependency-free-to-build (CDN-only, no bundler) single-page app for the
ShipShape maritime fleet & logistics platform, upgraded to use **Bootstrap 5**
for UI components/layout and **Axios** for HTTP, while keeping the original
component/service/store architecture and the navy chart-room visual identity.
It talks directly to the Spring Boot backend in `shipshape-backend`.

## What changed in this upgrade

- **Bootstrap 5.3** (CSS + JS bundle, via CDN) now provides buttons, forms,
  cards, the navbar, tables, badges, pagination, alerts, toasts, and modals.
  The custom chart-room theme (navy background, brass accents, Fraunces /
  Inter / JetBrains Mono type) is layered on top by re-pointing Bootstrap's
  own CSS variables (`--bs-primary`, `--bs-body-bg`, etc.) at the ShipShape
  palette, so every Bootstrap component inherits the look for free.
- **Bootstrap Icons** for small inline icons (nav links, buttons, dashboard
  stat cards).
- **Axios**, via a configured instance with request/response interceptors,
  replaces the hand-rolled `fetch()` wrapper. The interceptors inject the
  JWT bearer token on every request and normalize errors (network failure,
  401 → auto sign-out, and API `{ "message": "..." }` payloads) into the
  same global error banner as before. `Api.authService` / `vesselService` /
  `voyageService` / `cargoService` / `portService` keep the exact same
  method names and signatures, so page logic is unchanged.
- Hand-built modals (`.modal-overlay` / manual show-hide) were replaced with
  real Bootstrap `Modal` instances (`js/utils.js` → `Utils.modal(...)`).
- Status "pills" became Bootstrap `badge` elements; the vessel/cargo tables
  use `table table-dark`; pagination uses the Bootstrap pagination component.

## Run it

The app calls the API via Axios, so open it through a local web server
rather than double-clicking `index.html` (plain `file://` pages are blocked
by CORS in most browsers).

```bash
cd shipshape-frontend
python3 -m http.server 5173
# then visit http://localhost:5173
```

Any static server on port `3000` or `5173` works out of the box — those are
the two origins already whitelisted in the backend's `CorsConfig`.

This build has no `npm install` step — Bootstrap, Bootstrap Icons, Axios,
and Chart.js are all loaded from CDN in `index.html`.

## Point it at your backend

Edit `js/config.js`:

```js
window.SHIPSHAPE_CONFIG = {
  API_BASE_URL: "http://localhost:8080/api",
};
```

Start the Spring Boot backend on port 8080 first (`mvn spring-boot:run`), with
MySQL running per `application.properties`. The `DataSeeder` creates:

- Admin login: **admin / admin123** (role `SYSTEM_ADMIN`)
- Five seed ports (Singapore, Rotterdam, Shanghai, Los Angeles, Hamburg)

## What's inside

```
index.html               Shell: fonts, Bootstrap/Bootstrap Icons/Axios/Chart.js CDNs, mount points, script order
css/styles.css            Design tokens + Bootstrap CSS-variable theming + remaining custom flourishes
js/config.js              API base URL
js/utils.js               DOM builder + formatting helpers + Bootstrap modal helper
js/store.js               Pub-sub store: auth session, UI error/toast state
js/api.js                 Axios instance (interceptors for JWT + error handling) + auth/vessel/voyage/cargo/port services
js/router.js               Hash router with auth-gated routes
js/app.js                 Route registration + bootstrap
js/components/            Navbar, ErrorBanner, NotificationStack, EmptyState,
                           CapacityBar, SearchFilterBar — all Bootstrap-based
js/pages/                 Login, Register, Dashboard, Vessels, Voyages, Cargo, Ports
```

## Notes on backend fit

- Vessel edits after registration are limited to **status** changes, matching
  the backend's `PUT /api/vessels/{id}/status` endpoint (there's no full
  vessel-update endpoint) — name/IMO/type/tonnage are locked once created.
- Creating cargo sends `{ voyage: { id }, description, weightTons, cargoType,
  status }`, matching `CargoService.createCargo`, which resolves the nested
  voyage by id.
- Creating/deleting vessels and ports is restricted to `SYSTEM_ADMIN` in the
  UI, mirroring the `@PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")` rules
  on the backend. Non-admins will still get a clean 403 message from the
  `ErrorBanner` if they somehow hit a protected endpoint.
- All API errors are surfaced through the global banner in the exact
  `Error: <message>` format the SRS specifies for `ErrorHandler.jsx`.
