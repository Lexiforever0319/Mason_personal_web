/* =========================================================
   Site settings — edit these to customise the whole site.
   ========================================================= */
const SITE = {
  wordmark: "",   // top black bar
  name: "Mason Chan",                   // left side of nav strip
  pages: [
    { label: "Showreel",  href: "index.html" },
    { label: "Previz", href: "previz.html" },
    { label: "Layout",  href: "Layout.html" },
    { label: "About me",   href: "aboutme.html" },
  ],
  footer: "© " + new Date().getFullYear() + " Mason Chan",
};

/* <site-header> — shared header + navigation */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    const current = location.pathname.split("/").pop() || "index.html";
    const links = SITE.pages.map(p => `
      <li><a class="site-nav__link" href="${p.href}"
        ${p.href === current ? 'aria-current="page"' : ""}>${p.label}</a></li>`).join("");

    this.innerHTML = `
      <div class="site-bar"><span class="site-bar__mark">${SITE.wordmark}</span></div>
      <nav class="site-nav" aria-label="Main">
        <div class="site-nav__inner">
          <a class="site-nav__name" href="index.html">${SITE.name}</a>
          <button class="site-nav__toggle" aria-expanded="false" aria-controls="nav-list">Menu</button>
          <ul class="site-nav__list" id="nav-list">${links}</ul>
        </div>
      </nav>`;

    const nav = this.querySelector(".site-nav");
    const toggle = this.querySelector(".site-nav__toggle");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "Close" : "Menu";
    });
  }
}

/* <site-footer> — shared footer */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="site-footer">${SITE.footer}</footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

/* Subtle page transitions: fade in via CSS, fade out on internal links */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("pageshow", e => {
  if (e.persisted) document.body.classList.remove("is-leaving");
});

document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.hash || url.href === location.href) return;
  e.preventDefault();
  document.body.classList.add("is-leaving");
  setTimeout(() => (location.href = url.href), 320);
});
