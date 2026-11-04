/**
 * DevHorizon 2026 — theme interactions.
 *
 * Includes:
 * - Accessible mobile menu.
 * - Reusable speaker modal.
 * - Details toggles.
 * - Day and track filters.
 * - Bookmarks persisted in localStorage.
 */
(() => {
  'use strict';

  const BOOKMARK_KEY = 'devhorizon:bookmarks';
  const doc = document;
  const body = doc.body;

  const getBookmarks = () => {
    try {
      const raw = window.localStorage.getItem(BOOKMARK_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
      return [];
    }
  };

  const saveBookmarks = (bookmarks) => {
    try {
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      // If localStorage is unavailable, the UI keeps working in memory.
    }
  };

  const isBookmarked = (sessionId) => {
    if (!sessionId) {
      return false;
    }

    return getBookmarks().includes(String(sessionId));
  };

  const syncBookmarkUI = () => {
    doc.querySelectorAll('[data-bookmark-toggle]').forEach((button) => {
      const sessionId = String(button.dataset.sessionId || '');
      const saved = Boolean(sessionId) && isBookmarked(sessionId);

      button.classList.toggle('is-saved', saved);
      button.classList.toggle('saved', saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', saved ? 'Remove from my schedule' : 'Save to my schedule');

      if (button.classList.contains('btn-star')) {
        button.textContent = saved ? '★' : '☆';
      }
    });
  };

  const toggleBookmark = (sessionId) => {
    if (!sessionId) {
      return;
    }

    const bookmarks = getBookmarks();
    const normalized = String(sessionId);
    const index = bookmarks.indexOf(normalized);

    if (index >= 0) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(normalized);
    }

    saveBookmarks(bookmarks);
    syncBookmarkUI();
    doc.dispatchEvent(new CustomEvent('devhorizon:bookmarks-changed'));
  };

  /* -----------------------------------------------------------------------
   * Mobile menu
   * --------------------------------------------------------------------- */
  const menuToggle = doc.getElementById('menuToggle');
  const mobileDrawer = doc.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    const setMenuOpen = (open, restoreFocus = false) => {
      mobileDrawer.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

      if (open) {
        const firstLink = mobileDrawer.querySelector('a');
        if (firstLink) {
          window.setTimeout(() => {
            if (mobileDrawer.classList.contains('is-open')) {
              firstLink.focus();
            }
          }, 30);
        }
      } else if (restoreFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', () => {
      setMenuOpen(!mobileDrawer.classList.contains('is-open'));
    });

    mobileDrawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        setMenuOpen(false, true);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        setMenuOpen(false);
      }
    });
  }

  /* -----------------------------------------------------------------------
   * Session details toggles
   * --------------------------------------------------------------------- */
  doc.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-details-toggle]');

    if (!toggle) {
      return;
    }

    event.preventDefault();

    const targetId = toggle.getAttribute('aria-controls');
    const target = targetId ? doc.getElementById(targetId) : null;

    if (!target) {
      return;
    }

    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    target.hidden = expanded;
    toggle.textContent = expanded ? '+ SHOW DETAILS' : '— HIDE DETAILS';
  });

  /* -----------------------------------------------------------------------
   * Bookmarks
   * --------------------------------------------------------------------- */
  doc.addEventListener('click', (event) => {
    const button = event.target.closest('[data-bookmark-toggle]');

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    toggleBookmark(String(button.dataset.sessionId || ''));
  });

  /* -----------------------------------------------------------------------
   * Schedule filters
   * --------------------------------------------------------------------- */
  const filterBar = doc.querySelector('.page-schedule .filter-bar');

  if (filterBar) {
    const dayButtons = Array.from(filterBar.querySelectorAll('[data-filter-day]'));
    const trackButtons = Array.from(filterBar.querySelectorAll('[data-filter-track]'));
    const mineButton = filterBar.querySelector('[data-filter-mine]');
    const clearButton = filterBar.querySelector('[data-filter-clear]');
    const cards = Array.from(doc.querySelectorAll('.schedule-list .ticket-card'));
    const emptyMessage = doc.querySelector('.schedule-empty');

    let activeDay = 1;
    let activeTrack = '';
    let mineOnly = false;

    const params = new URLSearchParams(window.location.search);
    const dayParam = Number.parseInt(params.get('day'), 10);
    const trackParam = params.get('track');

    if ([1, 2, 3].includes(dayParam)) {
      activeDay = dayParam;
    }

    if (trackParam && trackButtons.some((button) => button.dataset.filterTrack === trackParam)) {
      activeTrack = trackParam;

      if (![1, 2, 3].includes(dayParam)) {
        activeDay = 0;
      }
    }

    const renderFilterState = () => {
      dayButtons.forEach((button) => {
        const active = Number.parseInt(button.dataset.filterDay, 10) === activeDay;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      trackButtons.forEach((button) => {
        const active = button.dataset.filterTrack === activeTrack;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      if (mineButton) {
        mineButton.classList.toggle('active', mineOnly);
        mineButton.setAttribute('aria-pressed', String(mineOnly));
      }
    };

    const applyFilters = () => {
      let visible = 0;

      cards.forEach((card) => {
        const day = Number.parseInt(card.dataset.day, 10);
        const track = card.dataset.track || '';
        const sessionId = String(card.dataset.sessionId || '');

        const matchesDay = !activeDay || day === activeDay;
        const matchesTrack = !activeTrack || track === activeTrack;
        const matchesMine = !mineOnly || isBookmarked(sessionId);

        const show = mineOnly ? matchesMine && matchesTrack : matchesDay && matchesTrack;

        card.hidden = !show;

        if (show) {
          visible += 1;
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visible > 0;
      }
    };

    const refresh = () => {
      renderFilterState();
      applyFilters();
    };

    dayButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const day = Number.parseInt(button.dataset.filterDay, 10);

        // Selecting a specific day exits "my schedule" mode.
        mineOnly = false;
        activeDay = activeDay === day ? 0 : day;
        refresh();
      });
    });

    trackButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const track = button.dataset.filterTrack || '';
        activeTrack = activeTrack === track ? '' : track;
        refresh();
      });
    });

    if (mineButton) {
      mineButton.addEventListener('click', () => {
        mineOnly = !mineOnly;
        // "My schedule" shows bookmarks from all days.
        activeDay = mineOnly ? 0 : 1;
        refresh();
      });
    }

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        activeDay = 1;
        activeTrack = '';
        mineOnly = false;
        refresh();
      });
    }

    doc.addEventListener('devhorizon:bookmarks-changed', () => {
      if (mineOnly) {
        applyFilters();
      }
    });

    syncBookmarkUI();
    refresh();
  }

  /* -----------------------------------------------------------------------
   * Speaker modal
   * --------------------------------------------------------------------- */
  const modal = doc.getElementById('speakerModal');

  if (modal) {
    const dialog = modal.querySelector('.modal-dialog');
    const closeButton = modal.querySelector('[data-modal-close]');
    const talkSectionTitle = modal.querySelector('.talk-section-title');
    const talkTicket = modal.querySelector('.talk-ticket');
    let lastFocusedElement = null;

    if (dialog) {
      dialog.setAttribute('tabindex', '-1');
    }

    const setText = (selector, value) => {
      const element = modal.querySelector(selector);

      if (element) {
        element.textContent = value || '';
      }
    };

    const setModalContent = (trigger) => {
      const data = trigger.dataset;
      const talkTitle = data.talkTitle || '';

      setText('[data-modal-name]', data.speakerName);
      setText('[data-modal-role]', data.speakerRole);
      setText('[data-modal-bio]', data.speakerBio);
      setText('[data-modal-author-name]', data.speakerName);
      setText('[data-modal-company]', data.speakerCompany);
      setText('[data-modal-talk-title]', talkTitle);
      setText('[data-modal-track]', data.talkTrack);
      setText('[data-modal-time-start]', data.talkTimeStart);
      setText('[data-modal-time-end]', data.talkTimeEnd);

      const photo = modal.querySelector('[data-modal-photo]');

      if (photo && data.speakerPhoto) {
        photo.src = data.speakerPhoto;
        photo.alt = data.speakerName || '';
      }

      const slash = modal.querySelector('.ticket-slash');

      if (slash) {
        slash.hidden = !data.speakerCompany;
      }

      if (talkSectionTitle) {
        talkSectionTitle.hidden = !talkTitle;
      }

      if (talkTicket) {
        talkTicket.hidden = !talkTitle;
      }

      const sessionId = String(data.sessionId || '');

      modal.querySelectorAll('[data-bookmark-toggle]').forEach((button) => {
        button.dataset.sessionId = sessionId;
        button.hidden = !sessionId;
      });

      syncBookmarkUI();
    };

    const openModal = (trigger) => {
      lastFocusedElement = doc.activeElement;
      setModalContent(trigger);
      modal.scrollTop = 0;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');

      window.setTimeout(() => {
        const focusTarget = closeButton || dialog;

        if (focusTarget && modal.classList.contains('is-open')) {
          focusTarget.focus();
        }
      }, 30);
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      body.classList.remove('modal-open');

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    const trapFocus = (event) => {
      if (!dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]):not([hidden]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    doc.addEventListener('click', (event) => {
      const closeTrigger = event.target.closest('[data-modal-close]');

      if (closeTrigger) {
        event.preventDefault();
        closeModal();
        return;
      }

      const openTrigger = event.target.closest('[data-modal-open]');

      if (!openTrigger) {
        return;
      }

      if (openTrigger.tagName === 'A') {
        event.preventDefault();
      }

      openModal(openTrigger);
    });

    doc.addEventListener('keydown', (event) => {
      if (!modal.classList.contains('is-open')) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key === 'Tab') {
        trapFocus(event);
      }
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const trigger = event.target.closest('[data-modal-open]');

      if (!trigger || trigger.tagName === 'A' || trigger.tagName === 'BUTTON') {
        return;
      }

      event.preventDefault();
      openModal(trigger);
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  syncBookmarkUI();
})();
