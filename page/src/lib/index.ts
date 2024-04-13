import { setupSearchForm } from "./search";
import { setupRequestForm } from "./request";

document.addEventListener("astro:after-swap", (e) => {
  const target = e.target as Window;

  if (target.location.pathname === "/") {
    setupSearchForm();
  }

  if (target.location.pathname === "/request") {
    setupRequestForm();
  }
});

export { setupRequestForm, setupSearchForm };
