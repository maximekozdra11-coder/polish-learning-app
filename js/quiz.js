/* js/quiz.js - Quiz module */

function initQuiz() {
  const vocabData = AppData.vocabulary;
  const lessonsData = AppData.lessons;

  let questions = [];
  let currentQ = 0;
  let score = 0;
  let totalQ = 10;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let answered = false;
  let quizType = 'vocabulary';

  const statsRow = document.getElementById('quiz-stats');
  const introEl = document.getElementById('quiz-intro');
  const questionEl = document.getElementById('quiz-question');
  const resultEl = document.getElementById('quiz-result');

  function getBestScore() {
    return parseInt(localStorage.getItem('quiz_best_score') || '0');
  }

  function renderStats() {
    const totalPlayed = parseInt(localStorage.getItem('quiz_total_played') || '0');
    const totalCorrect = parseInt(localStorage.getItem('quiz_total_correct') || '0');
    const best = getBestScore();
    const pct = totalPlayed > 0 ? Math.round(totalCorrect / totalPlayed * 100) : 0;

    statsRow.innerHTML = `
      <div class="stat-card"><div class="stat-number">${totalPlayed}</div><div class="stat-label">Questions</div></div>
      <div class="stat-card"><div class="stat-number">${best}%</div><div class="stat-label">Meilleur score</div></div>
      <div class="stat-card"><div class="stat-number">${pct}%</div><div class="stat-label">Réussite</div></div>
    `;
  }

  function generateVocabQuestions(count) {
    const allWords = [];
    vocabData.categories.forEach(cat => {
      cat.words.forEach(w => allWords.push({ ...w, category: cat.name }));
    });

    const shuffled = allWords.slice().sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    const qs = [];

    selected.forEach(word => {
      const type = Math.random() > 0.5 ? 'fr_to_pl' : 'pl_to_fr';
      const distractors = shuffled
        .filter(w => w !== word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (type === 'fr_to_pl') {
        const opts = [word.pl, ...distractors.map(d => d.pl)].sort(() => Math.random() - 0.5);
        qs.push({
          question: `Comment dit-on "${word.fr}" en polonais ?`,
          context: `[${word.phonetic}]`,
          options: opts,
          answer: opts.indexOf(word.pl),
          type: 'Français → Polonais'
        });
      } else {
        const opts = [word.fr, ...distractors.map(d => d.fr)].sort(() => Math.random() - 0.5);
        qs.push({
          question: `Que signifie "${word.pl}" ?`,
          context: word.phonetic ? `Prononciation : [${word.phonetic}]` : '',
          options: opts,
          answer: opts.indexOf(word.fr),
          type: 'Polonais → Français'
        });
      }
    });

    return qs;
  }

  function generateLessonQuestions(count) {
    const allQ = [];
    lessonsData.lessons.forEach(lesson => {
      lesson.quiz.forEach(q => allQ.push({ ...q, type: `Leçon : ${lesson.title}` }));
    });
    return allQ.sort(() => Math.random() - 0.5).slice(0, count);
  }

  function generateMixedQuestions(count) {
    const half = Math.ceil(count / 2);
    const vocabQs = generateVocabQuestions(half);
    const lessonQs = generateLessonQuestions(count - half);
    return [...vocabQs, ...lessonQs].sort(() => Math.random() - 0.5);
  }

  function startQuiz(count) {
    totalQ = count;
    currentQ = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    answered = false;

    const type = document.querySelector('input[name="quiz-type"]:checked')?.value || 'vocabulary';
    quizType = type;

    if (type === 'vocabulary') questions = generateVocabQuestions(count);
    else if (type === 'lessons') questions = generateLessonQuestions(count);
    else questions = generateMixedQuestions(count);

    if (questions.length < count) {
      showToast('⚠️ Pas assez de questions disponibles, quiz raccourci');
      totalQ = questions.length;
    }

    showScreen('question');
    renderQuestion();
  }

  function showScreen(screen) {
    introEl.classList.remove('active');
    questionEl.classList.remove('active');
    resultEl.classList.remove('active');
    if (screen === 'intro') introEl.classList.add('active');
    else if (screen === 'question') questionEl.classList.add('active');
    else if (screen === 'result') resultEl.classList.add('active');
  }

  function renderQuestion() {
    if (currentQ >= questions.length || currentQ >= totalQ) {
      showResult();
      return;
    }

    const q = questions[currentQ];
    answered = false;

    const pct = Math.round((currentQ / totalQ) * 100);
    document.getElementById('quiz-q-num').textContent = `Question ${currentQ + 1} / ${totalQ}`;
    document.getElementById('quiz-score-top').textContent = `${score} pts`;
    document.getElementById('quiz-progress-fill').style.width = pct + '%';
    document.getElementById('quiz-q-type').textContent = q.type || 'Traduction';
    document.getElementById('quiz-q-text').textContent = q.question;

    const ctx = document.getElementById('quiz-q-context');
    if (q.context) { ctx.textContent = q.context; ctx.style.display = ''; }
    else { ctx.style.display = 'none'; }

    const optContainer = document.getElementById('quiz-options');
    optContainer.innerHTML = '';
    const feedback = document.getElementById('quiz-feedback');
    feedback.className = 'quiz-feedback';
    document.getElementById('quiz-next-btn').style.display = 'none';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span> ${opt}`;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      optContainer.appendChild(btn);
    });
  }

  function handleAnswer(idx, btn) {
    if (answered) return;
    answered = true;

    const q = questions[currentQ];
    const allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);

    const feedback = document.getElementById('quiz-feedback');

    if (idx === q.answer) {
      btn.classList.add('correct');
      score += 10;
      correctAnswers++;
      feedback.className = 'quiz-feedback correct show';
      feedback.textContent = '✅ Correct ! Bravo !';
    } else {
      btn.classList.add('incorrect');
      allBtns[q.answer].classList.add('correct');
      incorrectAnswers++;
      feedback.className = 'quiz-feedback incorrect show';
      feedback.textContent = `❌ Incorrect. La bonne réponse était : "${q.options[q.answer]}"`;
    }

    document.getElementById('quiz-score-top').textContent = `${score} pts`;
    document.getElementById('quiz-next-btn').style.display = 'inline-flex';
  }

  function showResult() {
    const pct = totalQ > 0 ? Math.round((correctAnswers / totalQ) * 100) : 0;

    // Update best score
    const best = getBestScore();
    if (pct > best) localStorage.setItem('quiz_best_score', pct.toString());

    // Update totals
    const prevTotal = parseInt(localStorage.getItem('quiz_total_played') || '0');
    const prevCorrect = parseInt(localStorage.getItem('quiz_total_correct') || '0');
    localStorage.setItem('quiz_total_played', (prevTotal + totalQ).toString());
    localStorage.setItem('quiz_total_correct', (prevCorrect + correctAnswers).toString());

    showScreen('result');

    let emoji, message;
    if (pct === 100) { emoji = '🏆'; message = 'Score parfait ! Vous êtes incroyable !'; }
    else if (pct >= 80) { emoji = '⭐'; message = 'Excellent résultat ! Continuez comme ça !'; }
    else if (pct >= 60) { emoji = '👍'; message = 'Bon travail ! Encore quelques efforts !'; }
    else if (pct >= 40) { emoji = '💪'; message = 'Continuez à pratiquer, vous progressez !'; }
    else { emoji = '📚'; message = 'Repassez les leçons et réessayez !'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-score').textContent = `${correctAnswers}/${totalQ}`;
    document.getElementById('result-message').textContent = message;

    document.getElementById('result-stats').innerHTML = `
      <div class="stat-card"><div class="stat-number" style="color:var(--success);">${correctAnswers}</div><div class="stat-label">Corrects</div></div>
      <div class="stat-card"><div class="stat-number" style="color:var(--danger);">${incorrectAnswers}</div><div class="stat-label">Incorrects</div></div>
      <div class="stat-card"><div class="stat-number">${pct}%</div><div class="stat-label">Réussite</div></div>
    `;

    renderStats();
    if (typeof updateGlobalProgress === 'function') updateGlobalProgress();
  }

  // Event listeners
  document.getElementById('start-quiz-10').addEventListener('click', () => startQuiz(10));
  document.getElementById('start-quiz-20').addEventListener('click', () => startQuiz(20));

  document.getElementById('quiz-next-btn').addEventListener('click', () => {
    currentQ++;
    renderQuestion();
  });

  document.getElementById('quit-quiz').addEventListener('click', () => {
    if (confirm('Abandonner le quiz ?')) {
      showScreen('intro');
      renderStats();
    }
  });

  document.getElementById('retry-quiz').addEventListener('click', () => {
    startQuiz(totalQ);
  });

  document.getElementById('back-to-quiz-menu').addEventListener('click', () => {
    showScreen('intro');
    renderStats();
  });

  // Keyboard shortcut: 1-4 for answers
  document.addEventListener('keydown', e => {
    if (!questionEl.classList.contains('active') || answered) return;
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx <= 3) {
      const btns = document.querySelectorAll('.quiz-option');
      if (btns[idx]) btns[idx].click();
    }
    if (e.key === 'Enter' && answered) {
      document.getElementById('quiz-next-btn').click();
    }
  });

  renderStats();
}
