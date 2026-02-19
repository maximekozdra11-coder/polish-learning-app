/* js/pronunciation.js - Polish pronunciation guide */

function initPronunciation() {
  const container = document.getElementById('pronunciation-content');

  const alphabet = [
    { char: 'A a', name: 'a', sound: '[a]', desc: 'Comme "a" en français (patte)', examples: ['auto', 'mama', 'tak'] },
    { char: 'Ą ą', name: 'ą', sound: '[ɔ̃] / [om/on]', desc: 'Voyelle nasale : "on" devant consonne, "o" nasal à la fin', examples: ['mąż', 'pąk', 'będą'] },
    { char: 'B b', name: 'be', sound: '[b]', desc: 'Comme "b" en français', examples: ['brat', 'babcia', 'bieg'] },
    { char: 'C c', name: 'ce', sound: '[ts]', desc: 'Comme "ts" dans "tsar"', examples: ['cena', 'córka', 'ulica'] },
    { char: 'Ć ć', name: 'cie', sound: '[tɕ]', desc: 'Comme "tch" très mouillé, entre "tch" et "ty"', examples: ['ćma', 'pić', 'kończyć'] },
    { char: 'Ch ch', name: 'cha', sound: '[x]', desc: 'Comme "ch" en allemand (Bach) ou "j" espagnol', examples: ['chleb', 'chcę', 'herbata'] },
    { char: 'Cz cz', name: 'cze', sound: '[tʂ]', desc: 'Comme "tch" en français (tchin)', examples: ['cześć', 'czarny', 'cztery'] },
    { char: 'D d', name: 'de', sound: '[d]', desc: 'Comme "d" en français', examples: ['dom', 'dobry', 'dziękuję'] },
    { char: 'Dz dz', name: 'dze', sound: '[dz]', desc: 'Comme "dz" dans "adze"', examples: ['dzwonek', 'dzban', 'rdza'] },
    { char: 'Dź dź', name: 'dzie', sound: '[dʑ]', desc: 'Comme "dj" très mouillé', examples: ['dźwig', 'niedźwiedź'] },
    { char: 'Dż dż', name: 'dże', sound: '[dʐ]', desc: 'Comme "dj" dans "djembé"', examples: ['dżungla', 'dżins', 'dżem'] },
    { char: 'E e', name: 'e', sound: '[ɛ]', desc: 'Comme "è" en français (fête)', examples: ['jest', 'ten', 'jestem'] },
    { char: 'Ę ę', name: 'ę', sound: '[ɛ̃] / [em/en]', desc: 'Voyelle nasale : "en/em" devant consonne, légèrement nasal sinon', examples: ['będę', 'mężczyzna', 'więcej'] },
    { char: 'F f', name: 'ef', sound: '[f]', desc: 'Comme "f" en français', examples: ['forma', 'fiolet', 'kofeina'] },
    { char: 'G g', name: 'gie', sound: '[ɡ]', desc: 'Toujours "g" dur comme dans "gare"', examples: ['głowa', 'gorący', 'droga'] },
    { char: 'H h', name: 'ha', sound: '[x]', desc: 'Identique à "ch" en polonais, son guttural', examples: ['herbata', 'historia', 'hotel'] },
    { char: 'I i', name: 'i', sound: '[i]', desc: 'Comme "i" en français, adoucit la consonne précédente', examples: ['imię', 'ile', 'miło'] },
    { char: 'J j', name: 'jot', sound: '[j]', desc: 'Comme "y" dans "yeux"', examples: ['jak', 'jeden', 'jutro'] },
    { char: 'K k', name: 'ka', sound: '[k]', desc: 'Comme "k" en français', examples: ['kot', 'kawa', 'kupić'] },
    { char: 'L l', name: 'el', sound: '[l]', desc: 'Comme "l" en français', examples: ['lato', 'lalka', 'ulica'] },
    { char: 'Ł ł', name: 'eł', sound: '[w]', desc: 'Comme "w" anglais dans "water" — PAS comme "l" !', examples: ['łódź', 'biały', 'małpa'] },
    { char: 'M m', name: 'em', sound: '[m]', desc: 'Comme "m" en français', examples: ['mama', 'mąż', 'mówić'] },
    { char: 'N n', name: 'en', sound: '[n]', desc: 'Comme "n" en français', examples: ['nos', 'noga', 'nowy'] },
    { char: 'Ń ń', name: 'eń', sound: '[ɲ]', desc: 'Comme "gn" en français (montagne)', examples: ['koń', 'słoń', 'dzień'] },
    { char: 'O o', name: 'o', sound: '[ɔ]', desc: 'Comme "o" ouvert en français', examples: ['okno', 'dom', 'dobry'] },
    { char: 'Ó ó', name: 'o kresk.', sound: '[u]', desc: 'Se prononce exactement comme "u" !', examples: ['córka', 'mój', 'góra'] },
    { char: 'P p', name: 'pe', sound: '[p]', desc: 'Comme "p" en français', examples: ['pies', 'pić', 'proszę'] },
    { char: 'R r', name: 'er', sound: '[r]', desc: 'R roulé (comme en espagnol ou en russe)', examples: ['ryba', 'ręka', 'rodzina'] },
    { char: 'Rz rz', name: 'erz', sound: '[ʐ]', desc: 'Comme "j" en français (jour), mais plus fort', examples: ['rzeka', 'przez', 'może'] },
    { char: 'S s', name: 'es', sound: '[s]', desc: 'Comme "s" en français (souvent)', examples: ['serce', 'syn', 'stół'] },
    { char: 'Ś ś', name: 'eś', sound: '[ɕ]', desc: 'Comme "ch" très mouillé, entre "ch" et "sy"', examples: ['śnieg', 'środa', 'proszę'] },
    { char: 'Sz sz', name: 'esz', sound: '[ʂ]', desc: 'Comme "ch" en français (chat)', examples: ['szkoła', 'szybki', 'szary'] },
    { char: 'T t', name: 'te', sound: '[t]', desc: 'Comme "t" en français', examples: ['tak', 'tata', 'tunel'] },
    { char: 'U u', name: 'u', sound: '[u]', desc: 'Comme "ou" en français', examples: ['ulica', 'ucho', 'buty'] },
    { char: 'W w', name: 've', sound: '[v]', desc: 'Comme "v" en français (voiture)', examples: ['woda', 'wiatr', 'nowy'] },
    { char: 'Y y', name: 'y grec.', sound: '[ɨ]', desc: 'Son intermédiaire entre "i" et "ou", unique au polonais', examples: ['ryba', 'syn', 'dobry'] },
    { char: 'Z z', name: 'zet', sound: '[z]', desc: 'Comme "z" en français (zèbre)', examples: ['zupa', 'zero', 'ząb'] },
    { char: 'Ź ź', name: 'ziet', sound: '[ʑ]', desc: 'Comme "z" très mouillé', examples: ['źródło', 'gałąź'] },
    { char: 'Ż ż', name: 'żet', sound: '[ʐ]', desc: 'Identique à "rz" — comme "j" en français (jambe)', examples: ['żona', 'żółty', 'już'] }
  ];

  const specialChars = [
    { char: 'Ą ą', sound: 'on/om', desc: 'Voyelle nasale postérieure. Avant b/p : "om". Avant d/t/s/z : "on". En fin de mot : légèrement nasalisé.', examples: ['mąż (monch) = mari', 'będą (bèndon) = ils seront', 'pąk (ponk) = bourgeon'], tip: '👄 Pronunciez "o" avec de l\'air par le nez' },
    { char: 'Ę ę', sound: 'en/em', desc: 'Voyelle nasale antérieure. Avant b/p : "em". Avant d/t/s/z : "en". En fin de mot : souvent comme "e" simple.', examples: ['mężczyzna (mèn-chtchyz-na) = homme', 'będę (bèndè) = je serai', 'proszę (pro-chè) = s\'il vous plaît'], tip: '👄 Comme le "an" nasal de "enfant" mais plus ouvert' },
    { char: 'Ó ó', sound: 'ou', desc: 'Se prononce exactement comme "u" ! Historiquement différent du "o", mais la prononciation s\'est unifiée.', examples: ['córka (tsour-ka) = fille', 'góra (gou-ra) = montagne', 'mój (mouï) = mon'], tip: '✏️ S\'écrit différemment de "u" mais se prononce pareil' },
    { char: 'Ł ł', sound: 'w (anglais)', desc: 'NE PAS prononcer comme "l" ! Ce son est comme le "w" anglais dans "water" ou le "ou" semi-vocalique.', examples: ['łódź (woudj) = bateau', 'biały (bia-wy) = blanc', 'małpa (maw-pa) = singe'], tip: '⚠️ Erreur classique : le prononcer "l". C\'est "w" !' },
    { char: 'Ś ś', sound: 'chi mouillé', desc: 'Son palatal doux, entre "ch" et "si". La langue touche légèrement le palais.', examples: ['śnieg (chñieg) = neige', 'środa (chro-da) = mercredi', 'ślub (chloup) = mariage'], tip: '👄 Prononcez "ch" avec la langue remontée vers le palais' },
    { char: 'Ź ź', sound: 'z mouillé', desc: 'Version douce du "ż/rz". Comme "z" français mais la langue touche le palais.', examples: ['źródło (jrou-dwo) = source', 'więź (vieñj) = lien', 'gałąź (ga-wonj) = branche'], tip: '👄 Prononcez "z" avec la langue remontée' },
    { char: 'Ż ż', sound: 'j français', desc: 'Identique au son "j" en français (jambe, jour). Même chose que "rz".', examples: ['żona (jo-na) = femme/épouse', 'żółty (jow-ty) = jaune', 'już (youch) = déjà'], tip: '🇫🇷 Exactement le "j" de "bonjour" !' },
    { char: 'Ć ć', sound: 'tch mouillé', desc: 'Version douce du "cz". Comme "tch" mais la langue touche le palais doux.', examples: ['ćma (tch-ma) = teigne', 'pić (pitj) = boire', 'kończyć (koñ-tchitj) = finir'], tip: '👄 Prononcez "tch" avec la langue remontée' },
    { char: 'Ń ń', sound: 'gn français', desc: 'Exactement comme "gn" en français (montagne, agneau). Son nasal palatal.', examples: ['koń (koñ) = cheval', 'dzień (djeñ) = jour', 'słoń (swoñ) = éléphant'], tip: '🇫🇷 Comme le "gn" de "montagne" !' }
  ];

  let activeLetterIndex = null;

  function renderContent() {
    container.innerHTML = `
      <div class="card" style="margin-bottom:1rem;">
        <div class="card-header">
          <span class="card-title">🔤 Alphabet polonais (${alphabet.length} lettres)</span>
        </div>
        <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:1rem;">Cliquez sur une lettre pour voir sa prononciation</p>
        <div class="alphabet-grid" id="alphabet-grid"></div>
        <div id="letter-detail"></div>
      </div>

      <div class="card" style="margin-bottom:1rem;">
        <div class="card-header">
          <span class="card-title">⭐ Sons spéciaux polonais</span>
        </div>
        <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:1rem;">Ces sons n'existent pas en français — prêtez-y une attention particulière !</p>
        <div id="special-sounds"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">📌 Règles de prononciation essentielles</span>
        </div>
        <div id="rules-content"></div>
      </div>
    `;

    renderAlphabet();
    renderSpecialSounds();
    renderRules();
  }

  function renderAlphabet() {
    const grid = document.getElementById('alphabet-grid');
    alphabet.forEach((letter, idx) => {
      const card = document.createElement('div');
      card.className = 'letter-card';
      card.innerHTML = `
        <div class="letter-char">${letter.char.split(' ')[0]}</div>
        <div class="letter-name">${letter.sound}</div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.letter-card').forEach(c => c.classList.remove('active'));
        if (activeLetterIndex === idx) {
          activeLetterIndex = null;
          document.getElementById('letter-detail').innerHTML = '';
        } else {
          activeLetterIndex = idx;
          card.classList.add('active');
          showLetterDetail(letter);
        }
      });
      grid.appendChild(card);
    });
  }

  function showLetterDetail(letter) {
    document.getElementById('letter-detail').innerHTML = `
      <div class="pronunciation-detail">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem;">
          <span style="font-size:2.5rem;font-weight:700;color:var(--primary);">${letter.char}</span>
          <div>
            <div style="font-weight:600;">${letter.sound}</div>
            <div style="font-size:0.875rem;color:var(--text-muted);">${letter.desc}</div>
          </div>
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.4rem;font-weight:600;">Exemples :</div>
        <div class="phoneme-examples">
          ${letter.examples.map(ex => `<span class="example-chip">${ex}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function renderSpecialSounds() {
    const container2 = document.getElementById('special-sounds');
    specialChars.forEach(s => {
      const row = document.createElement('div');
      row.className = 'phoneme-row';
      row.innerHTML = `
        <div class="phoneme-char">${s.char.split(' ')[0]}</div>
        <div class="phoneme-info">
          <div class="phoneme-sound">${s.sound}</div>
          <div class="phoneme-desc">${s.desc}</div>
          <div style="margin:0.35rem 0;font-size:0.8rem;font-style:italic;color:var(--warning);">${s.tip}</div>
          <div class="phoneme-examples">
            ${s.examples.map(ex => `<span class="example-chip">${ex}</span>`).join('')}
          </div>
        </div>
      `;
      container2.appendChild(row);
    });
  }

  function renderRules() {
    const rules = [
      { title: 'L\'accent est toujours sur l\'avant-dernière syllabe', desc: 'En polonais, l\'accent tombe presque toujours sur la penultième syllabe. Ex : ma-MA, DO-bry, mó-WIMY (exception : 1ère pers. pluriel du passé).', example: 'Pol-ska / ka-wa / ro-dzi-na' },
      { title: 'Les consonnes en fin de mot sont assourdies', desc: 'En fin de mot ou avant une consonne sourde, les consonnes sonores deviennent sourdes. B→P, D→T, G→K, W→F, Z→S.', example: 'chleb = "hlep" / grób = "group"' },
      { title: 'Pas de lettres muettes', desc: 'Contrairement au français, toutes les lettres se prononcent en polonais (sauf dans quelques rares digraphes). Ce que vous voyez, vous le prononcez.', example: 'Warszawa = Var-cha-va (toutes les lettres)' },
      { title: 'Les voyelles sont toutes courtes', desc: 'Le polonais n\'a pas de distinction voyelle courte/longue comme l\'anglais. Chaque voyelle a la même durée.', example: 'Prononcez régulièrement : tak, nie, proszę' },
      { title: 'Groupes consonantiques complexes', desc: 'Le polonais peut avoir des groupes de consonnes qui paraissent imprononcables. Entraînez-vous progressivement.', example: 'szczyt (chommet) / źdźbło (brin d\'herbe)' }
    ];

    const wrap = document.getElementById('rules-content');
    rules.forEach(rule => {
      const div = document.createElement('div');
      div.style.cssText = 'padding:0.875rem 0;border-bottom:1px solid var(--border);';
      div.innerHTML = `
        <div style="font-weight:600;margin-bottom:0.25rem;">📌 ${rule.title}</div>
        <div style="font-size:0.875rem;color:var(--text-muted);margin-bottom:0.35rem;">${rule.desc}</div>
        <div style="font-size:0.8rem;background:var(--surface2);padding:0.4rem 0.75rem;border-radius:6px;font-family:monospace;">💬 ${rule.example}</div>
      `;
      wrap.appendChild(div);
    });
    wrap.lastChild.style.borderBottom = 'none';
  }

  renderContent();
}
