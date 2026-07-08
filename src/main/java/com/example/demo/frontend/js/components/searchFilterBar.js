// components/common/SearchFilterBar.jsx equivalent
const SearchFilterBar = {
  render({ statusOptions = [], onSearch, onFilter } = {}) {
    const searchInput = Utils.el("input", {
      type: "search",
      class: "form-control",
      placeholder: "Search...",
      "aria-label": "Search",
      onInput: Utils.debounce((e) => onSearch && onSearch(e.target.value), 200),
    });

    const select = Utils.el(
      "select",
      {
        class: "form-select",
        "aria-label": "Filter by status",
        onChange: (e) => onFilter && onFilter(e.target.value),
      },
      [
        Utils.el("option", { value: "" }, "All statuses"),
        ...statusOptions.map((status) => Utils.el("option", { value: status }, Utils.titleCase(status))),
      ]
    );

    return Utils.el("div", { class: "search-filter-bar row g-2 mb-3" }, [
      Utils.el("div", { class: "col-12 col-sm-8 col-md-5" }, searchInput),
      Utils.el("div", { class: "col-12 col-sm-4 col-md-3" }, select),
    ]);
  },
};
