/* js/lessons.js - Lessons module */

function initLessons() {
  const data = AppData.lessons;
  if (!data) return;

  const listView = document.getElementById('lessons-list-view');
  const detailView = document.getElementById('lesson-detail-view');
  const grid = document.getElementById('lessons-grid');
  const statsRow = document.getElementById('lessons-stats');
  let currentLevel = 'tous';

  function isComplete(id) {
    return !!localStorage.getItem(`lesson_complete_${id}`);
  }

  function renderStats() {
    const total = data.lessons.length;
    const done = data.lessons.filter(l => isComplete(l.id)).length;
    const byLevel = {};
    data.lessons.forEach(l => {
      if (!byLevel[l.level]) byLevel[l.level] = { total: 0, done: 0 };
      byLevel[l.level].total++;
      if (isComplete(l.id)) byLevel[l.level].done++;
    });

    statsRow.innerHTML = `
      <div class="stat-card"><div class="stat-number">${total}</div><div class="stat-label">Leçons</div></div>
      <div class="stat-card"><div class="stat-number">${done}</div><div class="stat-label">Terminées</div></div>
      <div class="stat-card"><div class="stat-number">${total > 0 ? Math.round(done/total*100) : 0}%</div><div class="stat-label">Progression</div></div>
    `;
  }

  function renderLessons() {
    grid.innerHTML = '';
    const filtered = currentLevel === 'tous'
      ? data.lessons
      : data.lessons.filter(l => l.level === currentLevel);

    filtered.forEach(lesson => {
      const done = isComplete(lesson.id);
      const levelColors = { 'Débutant': 'badge-success', 'Intermédiaire': 'badge-warning', 'Avancé': 'badge-danger' };
      const card = document.createElement('div');
      card.className = `lesson-card${done ? ' completed' : ''}`;
      card.innerHTML = `
        <div class="lesson-icon">${lesson.icon}</div>
        <div class="lesson-info">
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-meta">
            <span class="badge ${levelColors[lesson.level] || 'badge-primary'}">${lesson.level}</span>
            <span class="lesson-level">${lesson.objectives.length} objectifs · ${lesson.quiz.length} questions</span>
          </div>
        </div>
        ${done ? '<span class="lesson-check">✅</span>' : '<span style="color:var(--text-light);font-size:1.1rem;">›</span>'}
      `;
      card.addEventListener('click', () => openLesson(lesson));
      grid.appendChild(card);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">Aucune leçon pour ce niveau</div></div>';
    }
  }

  function openLesson(lesson) {
    listView.style.display = 'none';
    detailView.classList.add('active');
    renderLessonDetail(lesson);
  }

  function renderLessonDetail(lesson) {
    const done = isComplete(lesson.id);
    const content = document.getElementById('lesson-detail-content');

    let html = `
      <div class="card" style="margin-bottom:1rem;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <div style="font-size:1.5rem;margin-bottom:0.25rem;">${lesson.icon} ${lesson.title}</div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <span class="badge ${lesson.level === 'Débutant' ? 'badge-success' : lesson.level === 'Intermédiaire' ? 'badge-warning' : 'badge-danger'}">${lesson.level}</span>
              ${done ? '<span class="badge badge-success">✅ Terminée</span>' : ''}
            </div>
          </div>
          ${done ? '' : `<button class="btn btn-success btn-sm" id="complete-lesson-btn">Marquer terminée</button>`}
          ${done ? `<button class="btn btn-secondary btn-sm" id="uncomplete-lesson-btn">↩ Réinitialiser</button>` : ''}
        </div>

        <div style="margin-top:1rem;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.4rem;">OBJECTIFS</div>
          <ul style="list-style:none;display:grid;gap:0.3rem;">
            ${lesson.objectives.map(obj => `<li style="font-size:0.875rem;display:flex;align-items:center;gap:0.4rem;">✓ ${obj}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Content blocks
    lesson.content.forEach(block => {
      if (block.type === 'explanation') {
        html += `
          <div class="lesson-content-block content-explanation" style="margin-bottom:1rem;">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--primary);margin-bottom:0.5rem;">📖 Explication</div>
            <p style="font-size:0.9rem;line-height:1.7;">${block.text}</p>
          </div>
        `;
      } else if (block.type === 'vocabulary') {
        html += `
          <div class="lesson-content-block" style="margin-bottom:1rem;">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);margin-bottom:0.75rem;">📝 Vocabulaire</div>
            <div class="vocab-list">
              ${block.words.map(w => `
                <div class="vocab-item">
                  <span class="vocab-fr">${w.fr}</span>
                  <span class="vocab-pl">${w.pl}</span>
                  <span class="vocab-phonetic">[${w.phonetic}]</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else if (block.type === 'example') {
        html += `
          <div class="lesson-content-block content-example" style="margin-bottom:1rem;">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);margin-bottom:0.5rem;">💬 Exemple</div>
            <div class="example-fr">${block.fr}</div>
            <div class="example-pl">${block.pl}</div>
            <div class="example-phonetic">[${block.phonetic}]</div>
          </div>
        `;
      } else if (block.type === 'tip') {
        html += `
          <div class="lesson-content-block content-tip" style="margin-bottom:1rem;">
            <p style="font-size:0.9rem;">${block.text}</p>
          </div>
        `;
      }
    });

    // Quiz preview
    if (lesson.quiz && lesson.quiz.length > 0) {
      html += `
        <div class="card" style="margin-bottom:1rem;">
          <div class="card-header">
            <span class="card-title">✅ Quiz de la leçon</span>
            <span class="badge badge-primary">${lesson.quiz.length} questions</span>
          </div>
          <div id="lesson-quiz-container"></div>
        </div>
      `;
    }

    content.innerHTML = html;

    // Lesson quiz
    if (lesson.quiz && lesson.quiz.length > 0) {
      renderLessonQuiz(lesson, document.getElementById('lesson-quiz-container'));
    }

    // Buttons
    const completeBtn = document.getElementById('complete-lesson-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        localStorage.setItem(`lesson_complete_${lesson.id}`, '1');
        showToast('🎉 Leçon marquée comme terminée !');
        renderLessonDetail(lesson);
        if (typeof updateGlobalProgress === 'function') updateGlobalProgress();
      });
    }

    const uncompleteBtn = document.getElementById('uncomplete-lesson-btn');
    if (uncompleteBtn) {
      uncompleteBtn.addEventListener('click', () => {
        localStorage.removeItem(`lesson_complete_${lesson.id}`);
        showToast('↩️ Leçon réinitialisée');
        renderLessonDetail(lesson);
        if (typeof updateGlobalProgress === 'function') updateGlobalProgress();
      });
    }
  }

  function renderLessonQuiz(lesson, container) {
    const QUIZ_ANSWER_DELAY = 1200;
    let currentQ = 0;
    let score = 0;
    let answered = false;

    function renderQ() {
      if (currentQ >= lesson.quiz.length) {
        container.innerHTML = `
          <div style="text-align:center;padding:1.5rem;">
            <div style="font-size:2.5rem;margin-bottom:0.5rem;">🏆</div>
            <div style="font-size:1.5rem;font-weight:700;color:var(--primary);">${score}/${lesson.quiz.length}</div>
            <div style="font-size:0.875rem;color:var(--text-muted);margin:0.5rem 0 1rem;">${score === lesson.quiz.length ? 'Parfait ! 🌟' : score >= lesson.quiz.length / 2 ? 'Bien joué ! 👍' : 'Continuez à pratiquer ! 💪'}</div>
            <button class="btn btn-secondary btn-sm" id="retry-lesson-quiz">🔄 Recommencer</button>
          </div>
        `;
        document.getElementById('retry-lesson-quiz').addEventListener('click', () => { currentQ = 0; score = 0; renderQ(); });
        return;
      }

      const q = lesson.quiz[currentQ];
      answered = false;
      const letters = ['A', 'B', 'C', 'D'];

      container.innerHTML = `
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.4rem;">Question ${currentQ + 1}/${lesson.quiz.length}</div>
          <div style="font-weight:600;margin-bottom:0.75rem;">${q.question}</div>
          <div class="quiz-options" id="lq-options" style="grid-template-columns:1fr;"></div>
        </div>
      `;

      const optContainer = document.getElementById('lq-options');
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = `<span class="option-letter">${letters[i]}</span> ${opt}`;
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          optContainer.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
          if (i === q.answer) {
            btn.classList.add('correct');
            score++;
            showToast('✅ Correct !');
          } else {
            btn.classList.add('incorrect');
            optContainer.querySelectorAll('.quiz-option')[q.answer].classList.add('correct');
            showToast('❌ Incorrect');
          }
          setTimeout(() => { currentQ++; renderQ(); }, QUIZ_ANSWER_DELAY);
        });
        optContainer.appendChild(btn);
      });
    }

    renderQ();
  }

  // Level filter
  document.getElementById('level-filter').addEventListener('click', e => {
    const btn = e.target.closest('.level-btn');
    if (!btn) return;
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    renderLessons();
  });

  // Back button
  document.getElementById('lesson-back-btn').addEventListener('click', () => {
    detailView.classList.remove('active');
    listView.style.display = '';
    renderStats();
    renderLessons();
  });

  renderStats();
  renderLessons();
}
