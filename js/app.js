/* js/app.js - Main application controller */

(function () {
  'use strict';

  // Global app state
  window.AppData = {
    vocabulary: null,
    verbs: null,
    phrases: null,
    lessons: null,
    loaded: false
  };

  // Load all JSON data in parallel
  async function loadData() {
    try {
      const [vocab, verbs, phrases, lessons] = await Promise.all([
        fetch('data/vocabulary.json').then(r => r.json()),
        fetch('data/verbs.json').then(r => r.json()),
        fetch('data/phrases.json').then(r => r.json()),
        fetch('data/lessons.json').then(r => r.json())
      ]);
      AppData.vocabulary = vocab;
      AppData.verbs = verbs;
      AppData.phrases = phrases;
      AppData.lessons = lessons;
      AppData.loaded = true;
      return true;
    } catch (err) {
      console.error('Failed to load data:', err);
      return false;
    }
  }

  // Tab switching
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        sections.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        document.getElementById(target).classList.add('active');
        // Scroll tabs into view on mobile
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        updateGlobalProgress();
      });
    });

    // Handle hash navigation
    const hash = location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      const btn = document.querySelector(`[data-tab="${hash}"]`);
      if (btn) btn.click();
    }
  }

  // Global progress tracking
  function updateGlobalProgress() {
    if (!AppData.loaded) return;

    let totalItems = 0;
    let learnedItems = 0;

    // Count vocabulary learned
    if (AppData.vocabulary) {
      AppData.vocabulary.categories.forEach(cat => {
        const learned = JSON.parse(localStorage.getItem(`vocab_learned_${cat.id}`) || '[]');
        totalItems += cat.words.length;
        learnedItems += learned.length;
      });
    }

    // Count completed lessons
    if (AppData.lessons) {
      AppData.lessons.lessons.forEach(lesson => {
        totalItems += 1;
        if (localStorage.getItem(`lesson_complete_${lesson.id}`)) learnedItems += 1;
      });
    }

    const pct = totalItems > 0 ? Math.round((learnedItems / totalItems) * 100) : 0;
    document.getElementById('globalProgressBar').style.width = pct + '%';
    document.getElementById('globalProgressLabel').textContent = pct + '%';
  }

  // Toast notifications
  window.showToast = function (msg, duration = 2500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  };

  // Initialize app
  async function init() {
    const ok = await loadData();
    if (!ok) {
      document.getElementById('main-content').innerHTML =
        '<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">Impossible de charger les données. Veuillez récharger la page.</div></div>';
      return;
    }

    initTabs();

    // Initialize modules
    if (typeof initVocabulary === 'function') initVocabulary();
    if (typeof initPronunciation === 'function') initPronunciation();
    if (typeof initLessons === 'function') initLessons();
    if (typeof initQuiz === 'function') initQuiz();
    if (typeof initConjugation === 'function') initConjugation();
    if (typeof initPhrases === 'function') initPhrases();

    updateGlobalProgress();
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
