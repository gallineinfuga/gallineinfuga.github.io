export const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function normalizeLocale(value) {
  return value === "en" ? "en" : "it";
}

export function localized(value, locale) {
  if (typeof value === "string") return value;
  return value?.[locale] ?? value?.it ?? value?.en ?? "";
}

export function onlineOrderableCategories(site) {
  return site.categories.filter(
    (category) => category.onlineOrderable === true,
  );
}

function capabilityErrors(site) {
  const errors = [];
  for (const [name, capability] of Object.entries(site.capabilities ?? {})) {
    if (!capability || typeof capability !== "object") {
      errors.push(`Capability must be an object: ${name}`);
      continue;
    }

    if (capability.enabled === true && !capability.href) {
      errors.push(`Enabled capability requires href: ${name}`);
    }

    if (capability.href) {
      try {
        const url = new URL(capability.href, "https://gallineinfuga.github.io/");
        if (!["https:", "http:", "mailto:", "tel:"].includes(url.protocol)) {
          errors.push(`Unsupported capability protocol: ${name}`);
        }
      } catch {
        errors.push(`Invalid capability href: ${name}`);
      }
    }
  }
  return errors;
}

export function validateSiteData(site) {
  const errors = [];

  if (!site || typeof site !== "object") {
    return ["Site data must be an object"];
  }

  if (!site.brand?.name) {
    errors.push("brand.name is required");
  }

  if (!Array.isArray(site.categories) || site.categories.length === 0) {
    errors.push("At least one category is required");
  }

  const ids = new Set();
  for (const category of site.categories ?? []) {
    if (!category.id) {
      errors.push("Every category requires id");
      continue;
    }
    if (ids.has(category.id)) {
      errors.push(`Duplicate category id: ${category.id}`);
    }
    ids.add(category.id);

    if (
      category.saleRule === "counter-only" &&
      category.onlineOrderable !== false
    ) {
      errors.push(
        `Counter-only category cannot be online-orderable: ${category.id}`,
      );
    }

    if (
      category.soldByWeight === true &&
      (!Number.isFinite(category.weightIncrementKg) ||
        category.weightIncrementKg <= 0)
    ) {
      errors.push(
        `Weighted category requires positive weightIncrementKg: ${category.id}`,
      );
    }
  }

  if (ids.has("rosticceria-mignon")) {
    const mignon = site.categories.find(
      (category) => category.id === "rosticceria-mignon",
    );
    if (
      mignon?.soldByWeight !== true ||
      mignon?.weightIncrementKg !== 0.5
    ) {
      errors.push(
        "rosticceria-mignon must be sold by weight in 0.5 kg increments",
      );
    }
  }

  if (ids.has("rosticceria-palermitana")) {
    const palermitana = site.categories.find(
      (category) => category.id === "rosticceria-palermitana",
    );
    if (
      palermitana?.onlineOrderable !== false ||
      palermitana?.saleRule !== "counter-only"
    ) {
      errors.push(
        "rosticceria-palermitana must remain counter-only",
      );
    }
  }

  // Menu Master: pizza group prices are displayed ONCE per group, not
  // repeated for each pizza. All public data is display-only, never an order.
  const nameValid = (value) => value &&
    typeof value.it === "string" && value.it.trim() &&
    typeof value.en === "string" && value.en.trim();

  const groupsById = new Map();
  if (!Array.isArray(site.menuGroups)) {
    errors.push("menuGroups must be an array");
  } else {
    for (const group of site.menuGroups) {
      if (!group || typeof group !== "object" ||
          typeof group.id !== "string" ||
          !/^[a-z0-9-]+$/.test(group.id) ||
          groupsById.has(group.id) ||
          !ids.has(group.categoryId) ||
          !nameValid(group.name) ||
          !Array.isArray(group.prices) || group.prices.length === 0) {
        errors.push("Invalid menu price group");
        continue;
      }
      const variantIds = new Set();
      for (const price of group.prices) {
        if (!price || typeof price.id !== "string" || variantIds.has(price.id) ||
            !nameValid(price.label) || !Number.isSafeInteger(price.priceCents) ||
            price.priceCents <= 0) {
          errors.push(`Invalid group price: ${group.id}`);
        } else {
          variantIds.add(price.id);
        }
      }
      groupsById.set(group.id, group);
    }
  }

  const seenItems = new Set();
  if (!Array.isArray(site.menuItems) || site.menuItems.length === 0) {
    errors.push("menuItems must be a non-empty array");
  } else {
    for (const item of site.menuItems) {
      if (!item || typeof item !== "object" ||
          typeof item.id !== "string" || !/^[a-z0-9-]+$/.test(item.id) ||
          seenItems.has(item.id)) {
        errors.push("Invalid or duplicate menu item id");
        continue;
      }
      seenItems.add(item.id);
      if (!ids.has(item.categoryId)) {
        errors.push(`Unknown menu category: ${item.id}`);
      }
      if (!nameValid(item.name) ||
          (item.ingredients !== undefined && !nameValid(item.ingredients))) {
        errors.push(`Missing bilingual name/ingredients: ${item.id}`);
      }

      // Editorial copy is optional, but must be bilingual and cannot alter product facts.
      if (item.editorial !== undefined) {
        for (const channel of ["site", "hub", "order"]) {
          const copy = item.editorial[channel];
          if (!copy || typeof copy.it !== "string" || typeof copy.en !== "string") {
            errors.push(`Missing bilingual editorial text: ${item.id}/${channel}`);
          }
        }
      }

      const hasFixed = item.priceCents !== undefined;
      const hasChoices = item.priceChoicesCents !== undefined;
      const hasGroup = item.priceGroup !== undefined;
      if (Number(hasFixed) + Number(hasChoices) + Number(hasGroup) !== 1) {
        errors.push(`Menu item must have exactly one price source: ${item.id}`);
      }
      if (hasFixed &&
          (!Number.isSafeInteger(item.priceCents) || item.priceCents <= 0)) {
        errors.push(`Invalid confirmed price: ${item.id}`);
      }
      if (hasChoices &&
          (!Array.isArray(item.priceChoicesCents) ||
           item.priceChoicesCents.length < 2 ||
           item.priceChoicesCents.some((p) => !Number.isSafeInteger(p) || p <= 0) ||
           new Set(item.priceChoicesCents).size !== item.priceChoicesCents.length)) {
        errors.push(`Invalid price choices: ${item.id}`);
      }
      if (hasGroup &&
          (!groupsById.has(item.priceGroup) ||
            groupsById.get(item.priceGroup)?.categoryId !== item.categoryId)) {
        errors.push(`Unknown or mismatched price group: ${item.id}`);
      }
      const category = site.categories.find((value) => value.id === item.categoryId);
      if (category?.saleRule === "counter-only" && item.saleRule !== "counter-only") {
        errors.push(`Counter-only item requires counter-only restriction: ${item.id}`);
      }
      if (item.saleRule && item.saleRule !== "counter-only") {
        errors.push(`Unsupported item sale rule: ${item.id}`);
      }
      if (item.unit && item.unit !== "kg") {
        errors.push(`Unsupported menu unit: ${item.id}`);
      }
      if (category?.soldByWeight && item.unit !== "kg") {
        errors.push(`Weighted product must display kg price: ${item.id}`);
      }
    }
  }

  if (!Number.isSafeInteger(site.pizzaAdditions?.regularCents) ||
      site.pizzaAdditions.regularCents < 0 ||
      !Number.isSafeInteger(site.pizzaAdditions?.familyCents) ||
      site.pizzaAdditions.familyCents < 0) {
    errors.push("Invalid pizza additions prices");
  }

  for (const day of DAY_ORDER) {
    if (!site.hours?.[day]) {
      errors.push(`Missing opening-hours value: ${day}`);
    }
  }

  errors.push(...capabilityErrors(site));
  return errors;
}
