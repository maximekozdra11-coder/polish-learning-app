/* js/conjugation.js - Verb conjugation module */

function initConjugation() {
  const data = AppData.verbs;
  if (!data) return;

  const verbGrid = document.getElementById('verb-grid');
  const tableSection = document.getElementById('conjugation-table-section');
  const searchInput = document.getElementById('verb-search');

  let selectedVerb = null;
  let currentTense = 'present';
  let searchTerm = '';

  const tenseLabels = {
    present: 'Présent',
    past: 'Passé',
    future: 'Futur'
  };

  const pronounLabels = {
    present: [
      { key: 'je', label: 'je (ja)' },
      { key: 'tu', label: 'tu (ty)' },
      { key: 'il', label: 'il/elle (on/ona)' },
      { key: 'nous', label: 'nous (my)' },
      { key: 'vous', label: 'vous (wy)' },
      { key: 'ils', label: 'ils/elles (oni/one)' }
    ],
    past: [
      { key: 'je_m', label: 'je (masc.) — ja' },
      { key: 'je_f', label: 'je (fém.) — ja' },
      { key: 'tu_m', label: 'tu (masc.) — ty' },
      { key: 'tu_f', label: 'tu (fém.) — ty' },
      { key: 'il', label: 'il — on' },
      { key: 'elle', label: 'elle — ona' },
      { key: 'nous_m', label: 'nous (masc./mixte) — my' },
      { key: 'nous_f', label: 'nous (fém.) — my' },
      { key: 'vous_m', label: 'vous (masc./mixte) — wy' },
      { key: 'vous_f', label: 'vous (fém.) — wy' },
      { key: 'ils', label: 'ils — oni' },
      { key: 'elles', label: 'elles — one' }
    ],
    future: [
      { key: 'je', label: 'je (ja)' },
      { key: 'tu', label: 'tu (ty)' },
      { key: 'il', label: 'il/elle (on/ona)' },
      { key: 'nous', label: 'nous (my)' },
      { key: 'vous', label: 'vous (wy)' },
      { key: 'ils', label: 'ils/elles (oni/one)' }
    ]
  };

  function renderVerbGrid() {
    verbGrid.innerHTML = '';
    const filtered = data.verbs.filter(v =>
      !searchTerm ||
      v.fr.toLowerCase().includes(searchTerm) ||
      v.pl.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
      verbGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:1.5rem;"><div class="empty-icon">🔍</div><div class="empty-text">Aucun verbe trouvé</div></div>';
      return;
    }

    filtered.forEach(verb => {
      const card = document.createElement('div');
      card.className = `verb-card${selectedVerb && selectedVerb.fr === verb.fr ? ' selected' : ''}`;
      card.innerHTML = `
        <div>
          <div class="verb-fr">${verb.fr}</div>
          <div class="verb-pl">${verb.pl}</div>
        </div>
        <span class="badge ${verb.type === 'irrégulier' ? 'badge-warning' : 'badge-success'} verb-type-badge">
          ${verb.type === 'irrégulier' ? 'irrég.' : 'rég.'}
        </span>
      `;
      card.addEventListener('click', () => openVerb(verb));
      verbGrid.appendChild(card);
    });
  }

  function openVerb(verb) {
    selectedVerb = verb;
    currentTense = 'present';
    renderVerbGrid();
    tableSection.style.display = '';
    tableSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    document.getElementById('conj-verb-title').textContent = `${verb.fr} = ${verb.pl}`;
    document.getElementById('conj-verb-type').innerHTML = `
      <span class="badge ${verb.type === 'irrégulier' ? 'badge-warning' : 'badge-success'}">
        ${verb.type === 'irrégulier' ? '⚡ Irrégulier' : '✓ Régulier'}
      </span>
    `;

    updateTenseTabs();
    renderTable();
  }

  function updateTenseTabs() {
    document.querySelectorAll('.tense-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tense === currentTense);
    });
  }

  function renderTable() {
    if (!selectedVerb) return;
    const conjugations = selectedVerb.conjugations[currentTense];
    const pronouns = pronounLabels[currentTense];
    const wrap = document.getElementById('conjugation-table-wrap');

    let html = `
      <table class="conjugation-table">
        <thead>
          <tr>
            <th>Pronom</th>
            <th>Forme polonaise</th>
          </tr>
        </thead>
        <tbody>
    `;

    pronouns.forEach(p => {
      const form = conjugations[p.key];
      if (form !== undefined) {
        html += `
          <tr>
            <td>${p.label}</td>
            <td>${form}</td>
          </tr>
        `;
      }
    });

    html += '</tbody></table>';

    // Note for past tense
    if (currentTense === 'past') {
      html += `
        <div style="margin-top:0.75rem;padding:0.75rem;background:var(--surface2);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--text-muted);">
          💡 <strong>Note :</strong> En polonais, les formes du passé varient selon le genre du sujet. Les formes <em>_m</em> sont pour les sujets masculins ou mixtes, les formes <em>_f</em> pour les sujets féminins.
        </div>
      `;
    }

    wrap.innerHTML = html;
  }

  // Tense tabs
  document.getElementById('tense-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.tense-tab');
    if (!tab) return;
    currentTense = tab.dataset.tense;
    updateTenseTabs();
    renderTable();
  });

  // Close conjugation
  document.getElementById('close-conjugation').addEventListener('click', () => {
    tableSection.style.display = 'none';
    selectedVerb = null;
    renderVerbGrid();
  });

  // Search
  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.toLowerCase().trim();
    renderVerbGrid();
  });

  renderVerbGrid();
}
