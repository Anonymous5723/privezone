/**
 * PPP Database Manager — popup entry point.
 * Wires the data service, search logic, and UI rendering together.
 */

import { loadCountries } from './js/data-service.js';
import { filterCountries } from './js/search.js';
import { renderCountryList, renderCount, renderError } from './js/ui.js';

const elements = {
  list: document.getElementById('country-list'),
  emptyState: document.getElementById('empty-state'),
  errorState: document.getElementById('error-state'),
  searchInput: document.getElementById('search-input'),
  searchClear: document.getElementById('search-clear'),
  count: document.getElementById('country-count'),
  version: document.getElementById('app-version')
};

const openInNewTab = (url) => {
  chrome.tabs.create({ url });
};

const init = async () => {
  elements.version.textContent = `v${chrome.runtime.getManifest().version}`;

  let countries;
  try {
    countries = await loadCountries();
  } catch (error) {
    console.error('PPP Database Manager:', error);
    renderError({ container: elements.list, errorState: elements.errorState });
    return;
  }

  const update = () => {
    const query = elements.searchInput.value;
    const results = filterCountries(countries, query);

    renderCountryList({
      container: elements.list,
      emptyState: elements.emptyState,
      countries: results,
      onOpen: openInNewTab
    });
    renderCount(elements.count, results.length, countries.length);
    elements.searchClear.hidden = query === '';
  };

  elements.searchInput.addEventListener('input', update);
  elements.searchClear.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchInput.focus();
    update();
  });

  update();
};

init();
