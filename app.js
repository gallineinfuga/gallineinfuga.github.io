import {
  DAY_ORDER,
  localized,
  normalizeLocale,
  validateSiteData,
} from "./domain.js";

const copy = {
  it: {
    intro: "La fame ha trovato casa! Pizze, pollo allo spiedo e specialità tipiche siciliane, come la rosticceria. Scegli quello che preferisci: da asporto o con consegna a domicilio.",
    menuEditorial: "Di cosa hai voglia oggi? Dai un’occhiata alle nostre specialità e scegli quello che più ti stuzzica. Preparati a soddisfare la tua fame!",
    categoryIntro: {"pizzeria":"Dai grandi classici, quelli intramontabili, alle ricette più sfiziose che fanno venire l’acquolina al primo sguardo! Da noi trovi la pizza giusta per ogni voglia. Attenzione: sceglierne una sola potrebbe essere difficile!","polleria":"Il nostro pezzo forte? Il Pollo allo spiedo! Croccante fuori, morbido e succoso dentro: una vera tentazione.\n\nAccompagnato da un contorno a scelta tra patatine fritte o al forno. E tante sfiziosità tipiche della casa per completare il tutto.\n\nPerché il pollo è buono, ma con due stuzzichini in più è tutta un’altra cosa!","sfiziosita":"Hai voglia di qualcosa in più?\n\nQui da Galline in Fuga la fame ha trovato casa e ogni boccone diventa una sfiziosità!\n\nCompleta il tuo ordine con patatine fritte, chicken nuggets oppure un fantastico antipasto Siciliano misto.\n\nA noi galline piace stare in compagnia: a tavola mettiamo sempre qualcosa al centro, perché condividere le cose buone le rende ancora più buone!","rosticceria-palermitana":"Il Palermitano dà il meglio di sé anche a tavola!\n\nI nostri banconi ti aspettano con tante bontà tipiche della tradizione, tra profumi invitanti, impasti dorati e sapori tutti da scoprire.\n\nPassa a trovarci e lasciati tentare dalle nostre proposte: sceglierne una sola sarà difficile!","rosticceria-mignon":"Piccoli assaggi, grandi occasioni!\n\nCompleanni, lauree, feste o una semplice voglia di stare insieme: ogni occasione è buona per condividere qualcosa di sfizioso!\n\nLa nostra rosticceria mignon porta in tavola tante piccole bontà, perfette per rendere speciale ogni momento.\n\nTu organizza il tuo evento. Al mangiare ci pensiamo noi!\n\nContattaci e prepariamo insieme la soluzione più adatta alla tua occasione.","dolci":"Per concludere in bellezza…\n\nIl classico che non tramonta mai è lui: il cannolo siciliano!\n\nCroccante fuori, cremoso dentro: il finale perfetto per concederti ancora un piccolo piacere.","bevande":"E non dimenticarti la bibita per accompagnare la cena!"},
    hoursIntro: "Siamo aperti dal lunedì al sabato, dalle 16:00 alle 23:00.\n\nOppure, se preferisci, chiamaci e te lo portiamo noi a casa!",
    sunday: "La domenica anche le galline riposano… la domenica galleggiamo!",
    eventButton: "Organizza il tuo evento",
    starter: "Una selezione accurata di specialità della tradizione Siciliana, ricca di bontà e con un irresistibile mix di sapori. Perfetta da mettere al centro della tavola e da condividere con chi vuoi… sempre che qualcuno non finisca tutto prima degli altri!",
    siteView: "Scopri i sapori",
    hubView: "Menù rapido",
    menu: "Menù",
    menuBrowse: "Scopri il menù",
    menuPrice: "Prezzo",
    addedPizzaExtras: "Ingredienti in aggiunta",
    regular: "normale",
    family: "familiare",
    allergy: "Per informazioni sugli allergeni presenti nei prodotti, consulta la documentazione disponibile o rivolgiti al nostro staff prima di ordinare.",
    menuPending: "Prodotti e prezzi in aggiornamento",
    order: "Ordina online",
    contact: "Contatti",
    promos: "Promozioni",
    social: "Social",
    reviews: "Recensioni",
    hours: "Quando passi a trovarci?",
    menuHint: "Scegli una categoria per scoprire le nostre specialità.",
    service: "Da noi puoi trovare tutto, sia da asporto che con consegna a domicilio.",
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
    intro: "Your appetite has found a home! Pizzas, rotisserie chicken and Sicilian specialities, including traditional savouries. Choose takeaway or home delivery.",
    menuEditorial: "What are you craving today? Explore our specialities and choose whatever tempts you most!",
    categoryIntro: {"pizzeria":"From timeless classics to delicious creative recipes, there's a pizza for every craving. Choosing just one might be difficult!","polleria":"Our speciality? Rotisserie chicken! Crispy outside, tender and juicy inside, with your choice of fries or oven-baked potatoes and house specialities.","sfiziosita":"Fancy something extra? Add fries, chicken nuggets or a mixed Sicilian starter. Good food tastes even better when shared!","rosticceria-palermitana":"Palermo's food traditions at their finest! Visit our counter and discover golden, delicious local specialities.","rosticceria-mignon":"Small bites, big occasions! Birthdays, graduations, parties and gatherings: book our mini savouries for your event. You plan it; we'll take care of the food!","dolci":"A sweet ending… The timeless Sicilian cannolo: crispy outside, creamy inside.","bevande":"Don't forget a drink with your dinner!"},
    hoursIntro: "Open Monday to Saturday, 16:00–23:00.\n\nOr call us and we'll deliver to your home!",
    sunday: "Even our hens rest on Sundays… Sundays are for floating!",
    eventButton: "Plan your event",
    starter: "A carefully selected mix of Sicilian specialities, full of flavour and perfect for sharing.",
    siteView: "Explore our food",
    hubView: "Quick menu",
    menu: "Menu",
    menuBrowse: "Explore the menu",
    menuPrice: "Price",
    addedPizzaExtras: "Extra ingredients",
    regular: "regular",
    family: "family",
    allergy: "For information about allergens, consult the available documentation or ask our staff before ordering.",
    menuPending: "Products and prices being updated",
    order: "Order online",
    contact: "Contact",
    promos: "Promotions",
    social: "Social",
    reviews: "Reviews",
    hours: "When will you visit us?",
    menuHint: "Choose a category to discover our specialities.",
    service: "Find all our specialities for takeaway or home delivery.",
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
  document.querySelector("#menu-editorial").hidden = false;
  menu.replaceChildren();
  for (const category of site.categories) {
    const card = node("details", { className: "card menu-category" });
    const summary = node("summary", { className: "menu-category__toggle" });
    summary.append(node("span", { text: localized(category.name, locale) }));
    const count = site.menuItems.filter(item => item.categoryId === category.id).length;
    summary.append(node("small", { text: String(count) }));
    card.append(summary);
    if (t.categoryIntro[category.id]) card.append(node("p", { className: "category-intro", text: t.categoryIntro[category.id] }));
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
    if (category.id === "rosticceria-mignon" && site.capabilities.whatsapp?.enabled && site.capabilities.whatsapp.href) card.append(capabilityLink(site.capabilities.whatsapp, t.eventButton, t.contactUnavailable));
    if (category.id === "sfiziosita") { const starter = site.menuItems.find(item => item.categoryId === category.id && /antipasto.*siciliano|siciliano.*misto/i.test(localized(item.name, "it"))); if (starter) card.append(node("p", {className:"category-intro", text:t.starter})); }
    if (category.id === "pizzeria") card.append(node("p", { className: "meta menu-notice", text: `${t.addedPizzaExtras}: ${t.regular} +${money(site.pizzaAdditions.regularCents)} · ${t.family} +${money(site.pizzaAdditions.familyCents)}` }));
    menu.append(card);
  }

  const extras = site.pizzaAdditions;
  const eur = (cents) => new Intl.NumberFormat(
    locale === "en" ? "en-IE" : "it-IT",
    { style: "currency", currency: "EUR" }
  ).format(cents / 100);
  document.querySelector("#menu-additions").textContent = "";
  document.querySelector("#menu-allergies").textContent = t.allergy;

  document.querySelector("#hours-title").textContent = t.hours;
  document.querySelector("#hours-intro").textContent = t.hoursIntro;
  document.querySelector("#sunday-message").textContent = t.sunday;
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

  document.querySelector("#promos-section").hidden = !site.promotions.some(p => p.active === true);
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
