// modules/letters.js — 자음 탭 렌더링 및 퀴즈 모드

import { consonants, consonantGroups } from '../data/consonants.js';

export class LettersModule {
  constructor(store, tts) {
    this.store = store;
    this.tts = tts;
    this.currentGroup = 'all';
    this._bindFilter();
    this._bindQuizBtn();
    this._bindModal();
  }

  render() {
    this._renderGrid(this.currentGroup);
  }

  _bindFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentGroup = btn.dataset.group;
        this._renderGrid(this.currentGroup);
      });
    });
  }

  _bindQuizBtn() {
    document.getElementById('btn-letter-quiz').addEventListener('click', () => {
      this._startQuiz();
    });
  }

  _bindModal() {
    document.querySelector('#modal-letter .modal-backdrop').addEventListener('click', () => {
      this._closeModal();
    });
    document.querySelector('#modal-letter .modal-close').addEventListener('click', () => {
      this._closeModal();
    });
  }

  _renderGrid(group) {
    const grid = document.getElementById('consonant-grid');
    const learnedLetters = this.store.get('learnedLetters') || [];
    const missedLetters  = this.store.get('missedLetters') || [];

    const filtered = group === 'all'
      ? consonants
      : consonants.filter(c => c.group === group);

    grid.innerHTML = filtered.map(c => {
      const isLearned = learnedLetters.includes(c.char);
      const isMissed  = missedLetters.includes(c.char);
      return `
        <div class="consonant-card ${c.group} ${isLearned ? 'learned' : ''}"
             data-char="${c.char}">
          ${isMissed ? '<div class="c-missed-dot"></div>' : ''}
          <span class="c-char ${c.group}">${c.char}</span>
          <span class="c-rtgs">${c.rtgs}</span>
        </div>`;
    }).join('');

    grid.querySelectorAll('.consonant-card').forEach(card => {
      card.addEventListener('click', () => {
        const char = card.dataset.char;
        const consonant = consonants.find(c => c.char === char);
        if (consonant) this._openModal(consonant);
      });
    });
  }

  _openModal(consonant) {
    const learnedLetters = this.store.get('learnedLetters') || [];
    const isLearned = learnedLetters.includes(consonant.char);
    const groupColor = consonantGroups[consonant.group].color;

    document.getElementById('modal-letter-content').innerHTML = `
      <div class="letter-modal-char" style="color:${groupColor}">${consonant.char}</div>
      <div class="letter-modal-name">${consonant.name} · ${consonant.meaning}</div>
      <div class="letter-modal-rtgs">${consonant.rtgs}</div>
      <div class="letter-modal-example">
        <div class="example-label">예시 단어</div>
        <div class="example-thai">${consonant.example}</div>
        <div class="example-rtgs">${consonant.exampleRtgs}</div>
        <div class="example-korean">${consonant.exampleMeaning}</div>
      </div>
      <div class="letter-modal-actions">
        ${this.tts.renderBtn(consonant.char + ' ' + consonant.example)}
        <button class="btn-mark-learned ${isLearned ? 'already' : ''}"
                id="btn-mark-learned"
                data-char="${consonant.char}">
          ${isLearned ? '✓ 학습 완료' : '학습했어요'}
        </button>
      </div>`;

    document.getElementById('btn-mark-learned').addEventListener('click', async (e) => {
      const char = e.currentTarget.dataset.char;
      await this.store.markLetterLearned(char);
      e.currentTarget.textContent = '✓ 학습 완료';
      e.currentTarget.classList.add('already');
      this._renderGrid(this.currentGroup);
    });

    window.__tts = this.tts;
    document.getElementById('modal-letter').classList.remove('hidden');
  }

  _closeModal() {
    document.getElementById('modal-letter').classList.add('hidden');
  }

  // ── 퀴즈 모드 ───────────────────────────────────────
  _startQuiz() {
    const missedLetters = this.store.get('missedLetters') || [];
    const learnedLetters = this.store.get('learnedLetters') || [];

    // 우선순위: 틀린 것 → 아직 안 배운 것 순서로 최대 15개
    let queue = [];
    const missed = consonants.filter(c => missedLetters.includes(c.char));
    const unlearned = consonants.filter(c =>
      !learnedLetters.includes(c.char) && !missedLetters.includes(c.char)
    );
    const learned = consonants.filter(c => learnedLetters.includes(c.char));

    queue = [...missed, ...unlearned, ...learned].slice(0, 15);

    if (queue.length === 0) {
      alert('퀴즈할 자음이 없어요!');
      return;
    }

    this._runQuiz(queue, 0);
  }

  _runQuiz(queue, index) {
    if (index >= queue.length) {
      this._showQuizComplete(queue.length);
      return;
    }

    const consonant = queue[index];
    const groupColor = consonantGroups[consonant.group].color;
    const modal = document.getElementById('modal-flashcard');
    const content = document.getElementById('flashcard-content');

    content.innerHTML = `
      <div class="flashcard-header">
        <span class="fc-progress">${index + 1} / ${queue.length}</span>
        <span class="fc-queue-type">자음 퀴즈</span>
      </div>
      <div class="flashcard-body">
        <div class="fc-front" style="color:${groupColor}">${consonant.char}</div>
        <div class="fc-rtgs-hint">발음이 뭔지 생각해보세요</div>
        <div class="fc-reveal-hint">탭해서 확인</div>
        <div class="fc-back" id="fc-back">
          <div class="fc-korean" style="color:${groupColor}">${consonant.rtgs}</div>
          <div class="fc-rtgs">${consonant.name} · ${consonant.meaning}</div>
          <div class="fc-example">
            <div class="fc-example-thai">${consonant.example}</div>
            <div class="fc-example-rtgs">${consonant.exampleRtgs}</div>
            <div class="fc-example-ko">${consonant.exampleMeaning}</div>
          </div>
          <div class="fc-tts-row">
            ${this.tts.renderBtn(consonant.char, '발음 듣기')}
          </div>
          <div class="fc-actions">
            <button class="fc-btn-dontknow" id="fc-dontknow">틀렸어요</button>
            <button class="fc-btn-know" id="fc-know">알았어요 ✓</button>
          </div>
        </div>
      </div>`;

    // 탭해서 답 공개
    content.querySelector('.fc-reveal-hint').addEventListener('click', () => {
      document.getElementById('fc-back').classList.add('visible');
      content.querySelector('.fc-reveal-hint').remove();
    });
    content.querySelector('.fc-front').addEventListener('click', () => {
      const back = document.getElementById('fc-back');
      if (!back.classList.contains('visible')) {
        back.classList.add('visible');
        const hint = content.querySelector('.fc-reveal-hint');
        if (hint) hint.remove();
      }
    });

    window.__tts = this.tts;
    modal.classList.remove('hidden');

    // 알았어요
    document.getElementById('fc-know')?.addEventListener('click', async () => {
      await this.store.clearLetterMissed(consonant.char);
      await this.store.markLetterLearned(consonant.char);
      this._runQuiz(queue, index + 1);
    });

    // 틀렸어요
    document.getElementById('fc-dontknow')?.addEventListener('click', async () => {
      await this.store.markLetterMissed(consonant.char);
      this._runQuiz(queue, index + 1);
    });
  }

  _showQuizComplete(total) {
    const content = document.getElementById('flashcard-content');
    content.innerHTML = `
      <div class="fc-complete">
        <div class="fc-complete-emoji">🎉</div>
        <div class="fc-complete-title">퀴즈 완료!</div>
        <div class="fc-complete-sub">${total}개의 자음을 확인했어요</div>
        <button class="btn-secondary" id="fc-close-complete">닫기</button>
      </div>`;
    document.getElementById('fc-close-complete').addEventListener('click', () => {
      document.getElementById('modal-flashcard').classList.add('hidden');
      this._renderGrid(this.currentGroup);
    });
  }
}
