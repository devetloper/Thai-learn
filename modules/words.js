// modules/words.js — 단어 탭 (카테고리, 검색, 플래시카드)

import { words, categories } from '../data/words.js';

export class WordsModule {
  constructor(store, tts) {
    this.store = store;
    this.tts = tts;
    this._bindSearch();
    this._bindCategoryModal();
    this._bindFlashcardModal();
  }

  render() {
    this._renderCategories();
  }

  // ── 카테고리 목록 ──────────────────────────────────
  _renderCategories() {
    const learnedWords = this.store.get('learnedWords') || [];
    const missedWords  = this.store.get('missedWords') || [];
    const list = document.getElementById('category-list');

    list.innerHTML = categories.map(cat => {
      const catWords = words.filter(w => w.category === cat.id);
      const learnedCount = catWords.filter(w => learnedWords.includes(w.id)).length;
      const missedCount  = catWords.filter(w => missedWords.includes(w.id)).length;
      const pct = catWords.length > 0 ? Math.round(learnedCount / catWords.length * 100) : 0;

      return `
        <div class="category-item" data-cat="${cat.id}">
          <span class="cat-emoji">${cat.emoji}</span>
          <div class="cat-info">
            <div class="cat-label">${cat.label}</div>
            <div class="cat-thai">${cat.labelThai}</div>
            <div class="cat-progress">
              <div class="cat-progress-fill" style="width:${pct}%"></div>
            </div>
          </div>
          <div style="text-align:right">
            <div class="cat-count">${learnedCount}/${catWords.length}</div>
            ${missedCount > 0 ? `<div style="font-size:11px;color:var(--danger);margin-top:2px">복습 ${missedCount}</div>` : ''}
          </div>
          <svg class="cat-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`;
    }).join('');

    list.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', () => {
        const catId = item.dataset.cat;
        this._openCategory(catId);
      });
    });
  }

  // ── 검색 ───────────────────────────────────────────
  _bindSearch() {
    const input = document.getElementById('word-search');
    const results = document.getElementById('search-results');
    const clear = document.getElementById('search-clear');
    const catList = document.getElementById('category-list');

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clear.classList.toggle('hidden', q.length === 0);

      if (q.length === 0) {
        results.classList.add('hidden');
        catList.classList.remove('hidden');
        return;
      }

      const found = words.filter(w =>
        w.thai.includes(q) ||
        w.rtgs.toLowerCase().includes(q.toLowerCase()) ||
        w.korean.includes(q) ||
        w.example.includes(q) ||
        w.exampleKorean.includes(q)
      ).slice(0, 20);

      catList.classList.add('hidden');
      results.classList.remove('hidden');

      if (found.length === 0) {
        results.innerHTML = `<div style="text-align:center;color:var(--text3);padding:32px 0;font-size:14px">검색 결과가 없어요</div>`;
        return;
      }

      results.innerHTML = found.map(w => this._wordCardHTML(w)).join('');
      this._bindWordCardActions(results);
    });

    clear.addEventListener('click', () => {
      input.value = '';
      clear.classList.add('hidden');
      results.classList.add('hidden');
      results.innerHTML = '';
      catList.classList.remove('hidden');
    });
  }

  _wordCardHTML(w) {
    const missedWords = this.store.get('missedWords') || [];
    const isMissed = missedWords.includes(w.id);
    return `
      <div class="word-card ${isMissed ? 'missed' : ''}" data-id="${w.id}">
        ${isMissed ? '<span class="word-missed-tag">복습 필요</span>' : ''}
        <div class="word-thai">${w.thai}</div>
        <div class="word-rtgs">${w.rtgs}</div>
        <div class="word-korean">${w.korean}</div>
        <div class="word-example">
          <span class="ex-thai">${w.example}</span><br>
          ${w.exampleRtgs} · ${w.exampleKorean}
        </div>
      </div>`;
  }

  _bindWordCardActions(container) {
    container.querySelectorAll('.word-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const word = words.find(w => w.id === id);
        if (word) this._openWordFlashcard([word], 0, false);
      });
    });
  }

  // ── 카테고리 모달 ──────────────────────────────────
  _bindCategoryModal() {
    document.querySelector('#modal-category .modal-backdrop').addEventListener('click', () => {
      document.getElementById('modal-category').classList.add('hidden');
    });
    document.querySelector('#modal-category .modal-close').addEventListener('click', () => {
      document.getElementById('modal-category').classList.add('hidden');
    });
  }

  _openCategory(catId) {
    const cat = categories.find(c => c.id === catId);
    const catWords = words.filter(w => w.category === catId);
    const missedWords = this.store.get('missedWords') || [];

    // 틀린 것 먼저, 나머지는 순서대로
    const sorted = [
      ...catWords.filter(w => missedWords.includes(w.id)),
      ...catWords.filter(w => !missedWords.includes(w.id)),
    ];

    const content = document.getElementById('modal-category-content');
    content.innerHTML = `
      <div class="cat-modal-header">
        <div class="cat-modal-title">${cat.emoji} ${cat.label}</div>
        <div class="cat-modal-sub">${cat.labelThai} · ${catWords.length}개</div>
      </div>
      <button class="btn-primary" id="btn-cat-flashcard" style="margin-bottom:16px">
        플래시카드로 학습
        <span class="btn-sub">탭해서 뒤집기</span>
      </button>
      <div class="word-list">
        ${sorted.map(w => this._wordCardHTML(w)).join('')}
      </div>`;

    this._bindWordCardActions(content);

    content.getElementById?.('btn-cat-flashcard') ||
    content.querySelector('#btn-cat-flashcard')?.addEventListener('click', () => {
      document.getElementById('modal-category').classList.add('hidden');
      this._openWordFlashcard(sorted, 0, true);
    });

    document.getElementById('modal-category').classList.remove('hidden');
  }

  // ── 플래시카드 ─────────────────────────────────────
  _bindFlashcardModal() {
    document.querySelector('#modal-flashcard .modal-backdrop').addEventListener('click', () => {
      document.getElementById('modal-flashcard').classList.add('hidden');
      this.render(); // 진도 반영
    });
    document.querySelector('#modal-flashcard .modal-close').addEventListener('click', () => {
      document.getElementById('modal-flashcard').classList.add('hidden');
      this.render();
    });
  }

  _openWordFlashcard(queue, index, fromCategory = true) {
    if (index >= queue.length) {
      this._showFlashcardComplete(queue.length);
      return;
    }

    const word = queue[index];
    const modal = document.getElementById('modal-flashcard');
    const content = document.getElementById('flashcard-content');

    content.innerHTML = `
      <div class="flashcard-header">
        <span class="fc-progress">${index + 1} / ${queue.length}</span>
        <span class="fc-queue-type">단어 학습</span>
      </div>
      <div class="flashcard-body">
        <div class="fc-front">${word.thai}</div>
        <div class="fc-rtgs-hint">${word.rtgs}</div>
        <div class="fc-reveal-hint">탭해서 뜻 확인</div>
        <div class="fc-back" id="fc-back">
          <div class="fc-korean">${word.korean}</div>
          <div class="fc-tts-row">
            ${this.tts.renderBtn(word.thai + '. ' + word.example, '발음 듣기')}
          </div>
          <div class="fc-example">
            <div class="fc-example-thai">${word.example}</div>
            <div class="fc-example-rtgs">${word.exampleRtgs}</div>
            <div class="fc-example-ko">${word.exampleKorean}</div>
          </div>
          <div class="fc-actions">
            <button class="fc-btn-dontknow" id="fc-dontknow">모르겠어요</button>
            <button class="fc-btn-know" id="fc-know">알았어요 ✓</button>
          </div>
        </div>
      </div>`;

    // 탭해서 공개
    const revealBack = () => {
      document.getElementById('fc-back')?.classList.add('visible');
      content.querySelector('.fc-reveal-hint')?.remove();
    };
    content.querySelector('.fc-reveal-hint')?.addEventListener('click', revealBack);
    content.querySelector('.fc-front')?.addEventListener('click', revealBack);

    window.__tts = this.tts;
    modal.classList.remove('hidden');

    document.getElementById('fc-know')?.addEventListener('click', async () => {
      await this.store.markWordKnown(word.id);
      this._openWordFlashcard(queue, index + 1, fromCategory);
    });

    document.getElementById('fc-dontknow')?.addEventListener('click', async () => {
      await this.store.markWordMissed(word.id);
      this._openWordFlashcard(queue, index + 1, fromCategory);
    });
  }

  _showFlashcardComplete(total) {
    const content = document.getElementById('flashcard-content');
    content.innerHTML = `
      <div class="fc-complete">
        <div class="fc-complete-emoji">✨</div>
        <div class="fc-complete-title">학습 완료!</div>
        <div class="fc-complete-sub">${total}개의 단어를 확인했어요</div>
        <button class="btn-secondary" id="fc-close-complete">닫기</button>
      </div>`;
    document.getElementById('fc-close-complete').addEventListener('click', () => {
      document.getElementById('modal-flashcard').classList.add('hidden');
      document.getElementById('modal-category').classList.add('hidden');
      this.render();
    });
  }

  // 복습 큐로 플래시카드 시작 (today.js에서 호출)
  startReview() {
    const reviewQueue = this.store.get('reviewQueue') || [];
    if (reviewQueue.length === 0) return;
    const reviewWords = reviewQueue
      .map(id => words.find(w => w.id === id))
      .filter(Boolean);
    this._openWordFlashcard(reviewWords, 0, false);
  }
}
