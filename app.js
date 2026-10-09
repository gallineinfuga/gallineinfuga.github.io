import {
  DAY_ORDER,
  localized,
  normalizeLocale,
  validateSiteData,
} from "./domain.js";

const copy = {
  it: {
    intro: "La fame ha trovato casa. Pizza, pollo allo spiedo e specialità di rosticceria: scegli quello che ti va, da asporto o con consegna a domicilio.",
    menuEditorial: "Da Galline in Fuga trovi pizza, pollo allo spiedo, rosticceria palermitana e sfiziosità. Scegli quello che ti stuzzica e scopri le proposte disponibili.",
    categoryIntro: {pizzeria:"Dalle Classiche alle Speciali, fino a Ma che Bontà: trova la tua pizza.",polleria:"La tradizione che gira a regola d’arte: scegli tra mezzo pollo e pollo intero allo spiedo.",sfiziosita:"Perché il contorno giusto non è mai soltanto un contorno: patatine, nuggets e altre sfiziosità.","rosticceria-palermitana":"I sapori della tradizione, quelli che a Palermo non hanno bisogno di presentazioni. Specialità disponibili al banco.","rosticceria-mignon":"Piccole bontà da condividere: la rosticceria in formato mignon, prenotabile a multipli di mezzo chilo.",dolci:"Perché anche il finale merita il suo momento di gloria: scopri il cannolo e la Nutellosa.",bevande:"Tutto quello che serve per accompagnare il tuo ordine."},
    siteView: "Scopri i sapori",
    hubView: "Menù rapido",
    menu: "Menù",
    menuBrowse: "Sfoglia il menù",
    menuPrice: "Prezzo",
    addedPizzaExtras: "Aggiunte pizza",
    regular: "normale",
    family: "familiare",
    allergy: "Per intolleranze o allergie chiedi al nostro staff. La lista non sostituisce le informazioni sugli allergeni.",
    menuPending: "Prodotti e prezzi in aggiornamento",
    order: "Ordina online",
    contact: "Contatti",
    promos: "Novità",
    social: "Social",
    reviews: "Recensioni",
    hours: "Quando passi a trovarci?",
    menuHint: "Scegli una categoria. Le pizze sono proposte nei formati normale e familiare.",
    service: "Solo asporto e consegna a domicilio",
    orderUnavailable: "Ordine online in preparazione",
    contactUnavailable: "Contatto WhatsApp in configurazione",
    reviewsUnavailable: "Link recensioni in configurazione",
    counterOnly: "Disponibile al banco",
    weight: "Prenotabile a multipli di 0,5 kg",
    noPromos: "Le nuove promo compariranno qui.",
    noSocial: "I collegamenti social saranno pubblicati qui.",
    openLabel: "Aperto",
    closed: "Chiuso",
  },
  en: {
    intro: "Your appetite has found a home. Pizza, rotisserie chicken and Sicilian savouries, for takeaway or delivery.",
    menuEditorial: "Explore our pizzas, Palermo specialities and more, then choose your preferred size.",
    categoryIntro: {pizzeria:"From classics to specials: find your pizza.",polleria:"Rotisserie chicken and our chicken dishes.",sfiziosita:"Something tasty to complete your order.","rosticceria-palermitana":"Traditional Palermo savouries, available at the counter.","rosticceria-mignon":"Bite-sized savouries to share, available to pre-order in half-kilo increments.",dolci:"Finish on a sweet note with our available desserts.",bevande:"Find a drink to go with your order."},
    siteView: "Explore our food",
    hubView: "Quick menu",
    menu: "Menu",
    menuBrowse: "Browse the menu",
    menuPrice: "Price",
    addedPizzaExtras: "Pizza extras",
    regular: "regular",
    family: "family",
    allergy: "For intolerances or allergies, ask our staff. This menu is not an allergen chart.",
    menuPending: "Products and prices being updated",
    order: "Order online",
    contact: "Contact",
    promos: "News",
    social: "Social",
    reviews: "Reviews",
    hours: "When will you visit us?",
    menuHint: "Choose a category. Pizzas come in regular and family sizes.",
    service: "Takeaway and delivery only",
    orderUnavailable: "Online ordering is being prepared",
    contactUnavailable: "WhatsApp contact is being configured",
    reviewsUnavailable: "Review link is being configured",
    counterOnly: "Available at the counter",
    weight: "Pre-order in 0.5 kg increments",
    noPromos: "New promotions will appear here.",
    noSocial: "Social links will be published here.",
    openLabel: "Open",
    closed: "Closed",
  },
};

const dayLabels = {
  it: {
    monday: "Lunedì",
    tuesday: "Martedì",
    wednesday: "Mercoledì",
    thursday: "Giovedì",
    friday: "Venerdì",
    saturday: "Sabato",
    sunday: "Domenica",
  },
  en: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
};

function node(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.href) element.href = options.href;
  if (options.id) element.id = options.id;
  return element;
}

function capabilityLink(capability, label, fallback) {
  if (capability?.enabled === true && capability.href) {
    const link = node("a", {
      className: "action",
      text: label,
      href: capability.href,
    });
    link.rel = "noopener noreferrer";
    return link;
  }

  const disabled = node("span", {
    className: "action action--disabled",
    text: fallback,
  });
  disabled.setAttribute("aria-disabled", "true");
  return disabled;
}

function render(site, locale) {
  const t = copy[locale];
  document.documentElement.lang = locale;
  document.title = site.brand.name;

  document.querySelector("#brand-name").textContent = site.brand.name;
  document.querySelector("#descriptor").textContent =
    localized(site.brand.descriptor, locale);
  document.querySelector("#service-mode").textContent = t.service;
  document.querySelector("#editorial-intro").textContent = t.intro;
  document.querySelector("#menu-editorial").textContent = t.menuEditorial;

  const actions = document.querySelector("#primary-actions");
  const menuAnchor = node("a", {
    className: "action action--menu",
    text: t.menuBrowse,
    href: "#menu",
  });
  actions.replaceChildren(
    menuAnchor,
    capabilityLink(
      site.capabilities.onlineOrdering,
      t.order,
      t.orderUnavailable,
    ),
    capabilityLink(
      site.capabilities.whatsapp,
      t.contact,
      t.contactUnavailable,
    ),
  );

  const menuTitle = document.querySelector("#menu-title");
  menuTitle.textContent = t.menu;
  document.querySelector("#menu-hint").textContent = t.menuHint;
  const menu = document.querySelector("#menu-grid");
  const editorialMode = new URLSearchParams(location.search).get("view") === "site";
  const viewSwitch = document.querySelector("#menu-view-switch");
  viewSwitch.replaceChildren(
    node("a", { text: t.siteView, href: "?view=site#menu", className: editorialMode ? "view-active" : "" }),
    node("a", { text: t.hubView, href: "./#menu", className: editorialMode ? "" : "view-active" })
  );
  document.querySelector("#menu-editorial").hidden = !editorialMode;
  menu.replaceChildren();
  for (const category of site.categories) {
    const card = node("details", { className: "card menu-category" });
    const summary = node("summary", { className: "menu-category__toggle" });
    summary.append(node("span", { text: localized(category.name, locale) }));
    const count = site.menuItems.filter(item => item.categoryId === category.id).length;
    summary.append(node("small", { text: String(count) }));
    card.append(summary);
    if (editorialMode) card.append(node("p", { className: "category-intro", text: t.categoryIntro[category.id] || "" }));
    const money = (cents) => new Intl.NumberFormat(
      locale === "en" ? "en-IE" : "it-IT",
      { style: "currency", currency: "EUR" }
    ).format(cents / 100);

    function appendItems(target, items, showPrices) {
      const list = node("ul", { className: "menu-items" });
      if (category.id === "pizzeria") {
        list.classList.add("menu-items--pizza");
        const header = node("li", { className: "pizza-price-header" });
        header.append(node("span", { text: "" }), node("span", { text: t.regular }), node("span", { text: t.family }));
        list.append(header);
      }
      for (const item of items) {
        const row = node("li", { className: "menu-item" });
        const info = node("div", { className: "menu-item__info" });
        info.append(node("span", { className: "menu-item__name", text: localized(item.name, locale) }));
        if (item.ingredients) {
          info.append(node("span", {
            className: "menu-item__ingredients",
            text: localized(item.ingredients, locale),
          }));
        }
        const story = item.editorial?.site && localized(item.editorial.site, locale);
        if (editorialMode && story) info.append(node("span", { className: "menu-item__story", text: story }));
        row.append(info);
        if (category.id === "pizzeria" && !showPrices) {
          const group = site.menuGroups.find(group => group.id === item.priceGroup);
          const regular = group?.prices.find(price => price.id === "normale");
          const family = group?.prices.find(price => price.id === "familiare");
          const single = group?.prices.find(price => price.id === "unico");
          row.append(node("strong", { className: "price price--choice", text: regular ? money(regular.priceCents) : single ? money(single.priceCents) : "—" }));
          row.append(node("strong", { className: "price price--choice", text: family ? money(family.priceCents) : "—" }));
        }
        if (showPrices) {
          const formatted = item.priceChoicesCents
            ? item.priceChoicesCents.map(money).join(" / ")
            : money(item.priceCents) + (item.unit === "kg" ? "/kg" : "");
          row.append(node("strong", { className: "price", text: formatted }));
        }
        list.append(row);
      }
      target.append(list);
    }

    const groups = site.menuGroups.filter((group) => group.categoryId === category.id);
    for (const group of groups) {
      const groupItems = site.menuItems.filter((item) => item.priceGroup === group.id);
      if (groupItems.length === 0) continue;
      const section = node("div", { className: "menu-group" });
      section.append(
        node("h4", { text: localized(group.name, locale) }),
        
      );
      appendItems(section, groupItems, false);
      card.append(section);
    }
    const ungrouped = site.menuItems.filter((item) =>
      item.categoryId === category.id && !item.priceGroup
    );
    if (ungrouped.length > 0) {
      appendItems(card, ungrouped, true);
    } else if (groups.length === 0) {
      card.append(node("p", { className: "meta", text: t.menuPending }));
    }
    if (category.saleRule === "counter-only") {
      card.append(node("p", { className: "meta", text: t.counterOnly }));
    } else if (
      category.soldByWeight &&
      category.weightIncrementKg === 0.5
    ) {
      card.append(node("p", { className: "meta", text: t.weight }));
    }
    menu.append(card);
  }

  const extras = site.pizzaAdditions;
  const eur = (cents) => new Intl.NumberFormat(
    locale === "en" ? "en-IE" : "it-IT",
    { style: "currency", currency: "EUR" }
  ).format(cents / 100);
  document.querySelector("#menu-additions").textContent =
    `${t.addedPizzaExtras}: ${t.regular} +${eur(extras.regularCents)} · ${t.family} +${eur(extras.familyCents)}`;
  document.querySelector("#menu-allergies").textContent = t.allergy;

  document.querySelector("#hours-title").textContent = t.hours;
  const hours = document.querySelector("#hours-list");
  hours.replaceChildren();
  for (const day of DAY_ORDER) {
    const row = node("li", { className: "hours-row" });
    row.append(
      node("span", { text: dayLabels[locale][day] }),
      node("strong", {
        text:
          site.hours[day] === "closed"
            ? t.closed
            : site.hours[day],
      }),
    );
    hours.append(row);
  }

  document.querySelector("#promos-title").textContent = t.promos;
  document.querySelector("#promos-empty").textContent =
    site.promotions.length === 0 ? t.noPromos : "";

  document.querySelector("#social-title").textContent = t.social;
  document.querySelector("#social-empty").textContent =
    site.social.length === 0 ? t.noSocial : "";

  document.querySelector("#reviews-title").textContent = t.reviews;
  const reviewSlot = document.querySelector("#review-slot");
  reviewSlot.replaceChildren(
    capabilityLink(
      site.capabilities.reviews,
      t.reviews,
      t.reviewsUnavailable,
    ),
  );

  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.locale === locale),
    );
  });
}

async function main() {
  const response = await fetch("./data/site.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load site configuration");

  const site = await response.json();
  const errors = validateSiteData(site);
  if (errors.length > 0) {
    throw new Error(`Invalid site configuration: ${errors.join("; ")}`);
  }

  let locale = normalizeLocale(
    new URLSearchParams(location.search).get("lang") ??
      navigator.language?.slice(0, 2),
  );

  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.addEventListener("click", () => {
      locale = normalizeLocale(button.dataset.locale);
      render(site, locale);
    });
  });

  render(site, locale);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

main().catch((error) => {
  console.error(error);
  const status = document.querySelector("#app-status");
  status.hidden = false;
  status.textContent =
    "Configurazione temporaneamente non disponibile.";
});
