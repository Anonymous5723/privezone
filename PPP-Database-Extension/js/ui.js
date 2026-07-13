/**
 * UI layer — builds country cards and manages list/empty/error states.
 * DOM nodes are created programmatically; JSON values are never injected as HTML.
 */

const FLAG_DIR = 'assets/flags';

const ICONS = {
  database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>' +
    '<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>' +
    '<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
  emergency:
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>' +
    '<line x1="12" y1="9" x2="12" y2="13"></line>' +
    '<line x1="12" y1="17" x2="12.01" y2="17"></line>',
  unavailable:
    '<circle cx="12" cy="12" r="10"></circle>' +
    '<line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',
  language:
    '<circle cx="12" cy="12" r="10"></circle>' +
    '<line x1="2" y1="12" x2="22" y2="12"></line>' +
    '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
};

const createIcon = (name) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name];
  return svg;
};

const createElement = (tag, className, textContent = '') => {
  const element = document.createElement(tag);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
};

const createActionButton = ({ label, icon, variant, url, onOpen }) => {
  const button = createElement('button', `btn btn--${variant}`);
  button.type = 'button';
  button.append(createIcon(icon), document.createTextNode(label));

  if (url) {
    button.title = url;
    button.addEventListener('click', () => onOpen(url));
  } else {
    button.disabled = true;
    button.classList.remove(`btn--${variant}`);
    button.classList.add('btn--unavailable');
    button.title = 'No URL available in the source document';
  }

  return button;
};

const createFlag = ({ code, country }) => {
  const flag = createElement('img', 'country-card__flag');
  flag.alt = '';
  flag.src = `${FLAG_DIR}/${code || 'unknown'}.svg`;
  flag.addEventListener('error', () => flag.remove(), { once: true });
  flag.dataset.country = country;
  return flag;
};

const createCountryCard = (entry, onOpen) => {
  const card = createElement('article', 'country-card');
  card.setAttribute('role', 'listitem');

  const header = createElement('div', 'country-card__header');
  const identity = createElement('div', 'country-card__identity');
  identity.append(createElement('h2', 'country-card__name', entry.country));

  if (entry.language) {
    const language = createElement('span', 'country-card__language');
    language.append(createIcon('language'), document.createTextNode(entry.language));
    identity.append(language);
  }

  header.append(createFlag(entry), identity);
  card.append(header);

  if (entry.notes) {
    card.append(createElement('p', 'country-card__notes', entry.notes));
  }

  const actions = createElement('div', 'country-card__actions');
  actions.append(
    createActionButton({
      label: 'Open Database',
      icon: 'database',
      variant: 'database',
      url: entry.database,
      onOpen
    }),
    createActionButton({
      label: entry.emergency ? 'Emergency Authorization' : 'No Emergency URL',
      icon: entry.emergency ? 'emergency' : 'unavailable',
      variant: 'emergency',
      url: entry.emergency,
      onOpen
    })
  );
  card.append(actions);

  return card;
};

/**
 * Renders the given countries into the list container.
 */
export const renderCountryList = ({ container, emptyState, countries, onOpen }) => {
  container.replaceChildren(...countries.map((entry) => createCountryCard(entry, onOpen)));
  emptyState.hidden = countries.length > 0;
};

export const renderCount = (element, shown, total) => {
  element.textContent = shown === total ? `${total} countries` : `${shown} / ${total}`;
};

export const renderError = ({ container, errorState }) => {
  container.replaceChildren();
  errorState.hidden = false;
};
