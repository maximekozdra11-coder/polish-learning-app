/* js/vocabulary.js - Flashcard vocabulary module */

function initVocabulary() {
  const data = AppData.vocabulary;
  if (!data) return;

  let currentCategory = null;
  let currentWords = [];
  let currentIndex = 0;
  let isFlipped = false;
  let reviewMode = false;

  const categoryGrid = document.getElementById('category-grid');
  const categoriesSection = document.getElementById('vocab-categories');
  const flashcardSection = document.getElementById('vocab-flashcard-section');
  const statsRow = document.getElementById('vocab-stats');

  function getLearned(catId) {
    return JSON.parse(localStorage.getItem(`vocab_learned_${catId}`) || '[]');
  }

  function saveLearned(catId, learned) {
    localStorage.setItem(`vocab_learned_${catId}`, JSON.stringify(learned));
  }

  function renderStats() {
    let totalWords = 0;
    let learnedWords = 0;
    data.categories.forEach(cat => {
      totalWords += cat.words.length;
      learnedWords += getLearned(cat.id).length;
    });
    statsRow.innerHTML = `
      <div class="stat-card"><div class="stat-number">${data.categories.length}</div><div class="stat-label">Catégories</div></div>
      <div class="stat-card"><div class="stat-number">${totalWords}</div><div class="stat-label">Mots total</div></div>
      <div class="stat-card"><div class="stat-number">${learnedWords}</div><div class="stat-label">Appris</div></div>
      <div class="stat-card"><div class="stat-number">${totalWords > 0 ? Math.round(learnedWords/totalWords*100) : 0}%</div><div class="stat-label">Progression</div></div>
    `;
  }

  function renderCategories() {
    categoryGrid.innerHTML = '';
    data.categories.forEach(cat => {
      const learned = getLearned(cat.id);
      const pct = cat.words.length > 0 ? Math.round(learned.length / cat.words.length * 100) : 0;
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${cat.words.length} mots</div>
        <div class="category-progress-bar">
          <div class="category-progress-fill" style="width:${pct}%"></div>
        </div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">${learned.length}/${cat.words.length} appris</div>
      `;
      card.addEventListener('click', () => openCategory(cat));
      categoryGrid.appendChild(card);
    });
  }

  function openCategory(cat) {
    currentCategory = cat;
    reviewMode = false;
    const learned = getLearned(cat.id);
    currentWords = cat.words.slice();
    currentIndex = 0;
    isFlipped = false;

    document.getElementById('vocab-category-title').textContent = `${cat.icon} ${cat.name}`;
    document.getElementById('vocab-mode-label').textContent = 'Apprentissage';
    document.getElementById('vocab-toggle-mode').textContent = 'Mode révision';

    categoriesSection.style.display = 'none';
    statsRow.style.display = 'none';
    flashcardSection.style.display = 'block';

    renderFlashcard();
    updateLearnedDisplay();
  }

  function renderFlashcard() {
    if (currentWords.length === 0) return;
    const word = currentWords[currentIndex];
    const card = document.getElementById('flashcard');
    const learned = getLearned(currentCategory.id);

    document.getElementById('flashcard-fr').textContent = word.fr;
    document.getElementById('flashcard-pl').textContent = word.pl;
    document.getElementById('flashcard-phonetic').textContent = word.phonetic ? `[${word.phonetic}]` : '';

    const genderMap = { m: 'masculin', f: 'féminin' };
    const genderBadge = word.gender ? `<span class="badge badge-primary">${genderMap[word.gender] ?? ''}</span>` : '';
    document.getElementById('flashcard-gender').innerHTML = genderBadge;

    // Indicate if learned
    const learnedBtn = document.getElementById('flashcard-learned');
    const isLearned = learned.includes(word.pl + '_' + word.fr);
    learnedBtn.textContent = isLearned ? '✓ Déjà appris' : '✓ Marquer appris';
    learnedBtn.className = isLearned ? 'btn btn-secondary btn-sm' : 'btn btn-success btn-sm';

    // Reset flip
    isFlipped = false;
    card.classList.remove('flipped');

    document.getElementById('flashcard-counter').textContent = `${currentIndex + 1} / ${currentWords.length}`;
    document.getElementById('flashcard-prev').disabled = currentIndex === 0;
    document.getElementById('flashcard-next').disabled = currentIndex === currentWords.length - 1;
  }

  function updateLearnedDisplay() {
    const learned = getLearned(currentCategory.id);
    const total = currentCategory.words.length;
    const count = learned.length;
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    document.getElementById('learned-count').textContent = `${count} / ${total} appris (${pct}%)`;
    document.getElementById('learned-progress').style.width = pct + '%';
  }

  // Flashcard flip
  document.getElementById('flashcard').addEventListener('click', () => {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
  });

  document.getElementById('flashcard-flip').addEventListener('click', () => {
    isFlipped = !isFlipped;
    document.getElementById('flashcard').classList.toggle('flipped', isFlipped);
  });

  // Navigation
  document.getElementById('flashcard-prev').addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; renderFlashcard(); }
  });

  document.getElementById('flashcard-next').addEventListener('click', () => {
    if (currentIndex < currentWords.length - 1) { currentIndex++; renderFlashcard(); }
    else showToast('🎉 Fin de la catégorie !');
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!flashcardSection.style.display || flashcardSection.style.display === 'none') return;
    if (e.key === 'ArrowRight' && currentIndex < currentWords.length - 1) { currentIndex++; renderFlashcard(); }
    if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; renderFlashcard(); }
    if (e.key === ' ') { e.preventDefault(); isFlipped = !isFlipped; document.getElementById('flashcard').classList.toggle('flipped', isFlipped); }
  });

  // Mark as learned
  document.getElementById('flashcard-learned').addEventListener('click', () => {
    const word = currentWords[currentIndex];
    const key = word.pl + '_' + word.fr;
    const learned = getLearned(currentCategory.id);
    if (!learned.includes(key)) {
      learned.push(key);
      saveLearned(currentCategory.id, learned);
      showToast('✅ Mot marqué comme appris !');
    } else {
      const idx = learned.indexOf(key);
      learned.splice(idx, 1);
      saveLearned(currentCategory.id, learned);
      showToast('↩️ Mot retiré des appris');
    }
    renderFlashcard();
    updateLearnedDisplay();
    if (typeof updateGlobalProgress === 'function') updateGlobalProgress();
  });

  // Shuffle
  document.getElementById('flashcard-shuffle').addEventListener('click', () => {
    currentWords = currentWords.slice().sort(() => Math.random() - 0.5);
    currentIndex = 0;
    renderFlashcard();
    showToast('🔀 Cartes mélangées !');
  });

  // Toggle mode
  document.getElementById('vocab-toggle-mode').addEventListener('click', () => {
    reviewMode = !reviewMode;
    if (reviewMode) {
      const learned = getLearned(currentCategory.id);
      const learnedKeys = new Set(learned);
      currentWords = currentCategory.words.filter(w => !learnedKeys.has(w.pl + '_' + w.fr));
      if (currentWords.length === 0) {
        showToast('🏆 Tous les mots de cette catégorie sont appris !');
        currentWords = currentCategory.words.slice();
        reviewMode = false;
        document.getElementById('vocab-mode-label').textContent = 'Apprentissage';
        document.getElementById('vocab-toggle-mode').textContent = 'Mode révision';
        return;
      }
      document.getElementById('vocab-mode-label').textContent = 'Révision';
      document.getElementById('vocab-toggle-mode').textContent = 'Mode apprentissage';
      showToast(`📖 ${currentWords.length} mots à réviser`);
    } else {
      currentWords = currentCategory.words.slice();
      document.getElementById('vocab-mode-label').textContent = 'Apprentissage';
      document.getElementById('vocab-toggle-mode').textContent = 'Mode révision';
    }
    currentIndex = 0;
    isFlipped = false;
    renderFlashcard();
  });

  // Back button
  document.getElementById('vocab-back-btn').addEventListener('click', () => {
    flashcardSection.style.display = 'none';
    categoriesSection.style.display = '';
    statsRow.style.display = '';
    renderStats();
    renderCategories();
  });

  // Initial render
  renderStats();
  renderCategories();
}
