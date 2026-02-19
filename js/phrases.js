/* js/phrases.js - Useful phrases module */

function initPhrases() {
  const data = AppData.phrases;
  if (!data) return;

  const listContainer = document.getElementById('phrases-list');
  const searchInput = document.getElementById('phrase-search');
  const countLabel = document.getElementById('phrases-count');
  let showFavoritesOnly = false;
  let searchTerm = '';
  let openCategories = new Set();

  function getFavorites() {
    return JSON.parse(localStorage.getItem('phrase_favorites') || '[]');
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) { favs.push(id); showToast('⭐ Ajouté aux favoris'); }
    else { favs.splice(idx, 1); showToast('✕ Retiré des favoris'); }
    localStorage.setItem('phrase_favorites', JSON.stringify(favs));
  }

  function isFavorite(id) {
    return getFavorites().includes(id);
  }

  function getPhraseId(catId, phraseIdx) {
    return `${catId}_${phraseIdx}`;
  }

  function matchesSearch(phrase) {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      phrase.fr.toLowerCase().includes(term) ||
      phrase.pl.toLowerCase().includes(term) ||
      (phrase.phonetic && phrase.phonetic.toLowerCase().includes(term)) ||
      (phrase.context && phrase.context.toLowerCase().includes(term))
    );
  }

  function render() {
    listContainer.innerHTML = '';
    const favs = getFavorites();
    let totalVisible = 0;

    data.categories.forEach(cat => {
      let phrases = cat.phrases.filter((p, i) => {
        const id = getPhraseId(cat.id, i);
        if (showFavoritesOnly && !isFavorite(id)) return false;
        return matchesSearch(p);
      });

      if (phrases.length === 0) return;
      totalVisible += phrases.length;

      const catEl = document.createElement('div');
      catEl.className = 'phrase-cat-card';
      const isOpen = openCategories.has(cat.id) || searchTerm || showFavoritesOnly;

      catEl.innerHTML = `
        <div class="phrase-cat-header${isOpen ? ' open' : ''}" data-cat="${cat.id}">
          <span class="phrase-cat-icon">${cat.icon}</span>
          <span class="phrase-cat-name">${cat.name}</span>
          <span class="phrase-cat-count">${phrases.length} phrase${phrases.length > 1 ? 's' : ''}</span>
          <span class="phrase-cat-toggle">▼</span>
        </div>
        <div class="phrase-list${isOpen ? ' open' : ''}" id="cat-phrases-${cat.id}"></div>
      `;

      const header = catEl.querySelector('.phrase-cat-header');
      const phraseList = catEl.querySelector('.phrase-list');

      header.addEventListener('click', () => {
        const isNowOpen = phraseList.classList.toggle('open');
        header.classList.toggle('open', isNowOpen);
        if (isNowOpen) openCategories.add(cat.id);
        else openCategories.delete(cat.id);
      });

      // Render phrase items
      phrases.forEach((phrase, displayIdx) => {
        const realIdx = cat.phrases.indexOf(phrase);
        const id = getPhraseId(cat.id, realIdx);
        const fav = isFavorite(id);

        const item = document.createElement('div');
        item.className = 'phrase-item';
        item.innerHTML = `
          <div class="phrase-texts">
            <div class="phrase-fr">${phrase.fr}</div>
            <div class="phrase-pl">${phrase.pl}</div>
            ${phrase.phonetic ? `<div class="phrase-phonetic">[${phrase.phonetic}]</div>` : ''}
            ${phrase.context ? `<div class="phrase-context">ℹ️ ${phrase.context}</div>` : ''}
          </div>
          <button class="phrase-fav-btn${fav ? ' active' : ''}" data-id="${id}" title="${fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
            ${fav ? '⭐' : '☆'}
          </button>
        `;

        item.querySelector('.phrase-fav-btn').addEventListener('click', e => {
          e.stopPropagation();
          toggleFavorite(id);
          render();
        });

        phraseList.appendChild(item);
      });

      listContainer.appendChild(catEl);
    });

    // Show favorites section if filtering
    if (showFavoritesOnly && totalVisible === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-text">Aucun favori pour l'instant.<br>Cliquez sur ☆ pour ajouter des phrases.</div>
        </div>
      `;
    }

    // Count
    const total = data.categories.reduce((sum, cat) => sum + cat.phrases.length, 0);
    if (searchTerm || showFavoritesOnly) {
      countLabel.textContent = `${totalVisible} phrase${totalVisible > 1 ? 's' : ''} trouvée${totalVisible > 1 ? 's' : ''}`;
    } else {
      countLabel.textContent = `${total} phrases dans ${data.categories.length} catégories`;
    }
  }

  // Search
  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    openCategories.clear();
    render();
  });

  // Favorites toggle
  document.getElementById('show-favorites').addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    const btn = document.getElementById('show-favorites');
    btn.textContent = showFavoritesOnly ? '📚 Toutes les phrases' : '⭐ Favoris';
    btn.className = showFavoritesOnly ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    openCategories.clear();
    render();
  });

  render();
}
