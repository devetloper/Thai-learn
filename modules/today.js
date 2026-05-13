// modules/today.js — 오늘 탭 (스트릭, 목표, 복습 큐)

import { words } from '../data/words.js';

export class TodayModule {
  constructor(store, wordsModule) {
    this.store = store;
    this.wordsModule = wordsModule;
    this._bindReviewBtn();
    this._bindRestartBtn();
  }

  render() {
    this._renderStreak();
    this._renderGoal();
    this._renderStats();
    this._renderReviewQueue();
  }

  _renderStreak() {
    const streak = this.store.get('streak') || 0;
    const studyDates = this.store.get('studyDates') || [];
    const streakBroken = this.store.get('streakBroken');

    // 헤더 스트릭 뱃지
    document.getElementById('streak-count').textContent = streak;
    document.getElementById('today-streak-num').textContent = streak;

    // 스트릭 끊김 메시지
    const brokenMsg = document.getElementById('streak-broken-msg');
    brokenMsg.classList.toggle('hidden', !streakBroken);

    // 캘린더 (최근 35일)
    const cal = document.getElementById('streak-calendar');
    const today = new Date();
    const days = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    cal.innerHTML = days.map(dateStr => {
      const isDone  = studyDates.includes(dateStr);
      const isToday = dateStr === today.toISOString().slice(0, 10);
      const dayNum  = new Date(dateStr).getDate();
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      else if (isDone) cls += ' done';
      return `<div class="${cls}">${dayNum}</div>`;
    }).join('');
  }

  _renderGoal() {
    const stats = this.store.get('todayStats') || { letters: 0, words: 0, review: 0 };
    const total = stats.letters + stats.words + stats.review;
    const goal = 5;
    const pct = Math.min(100, Math.round(total / goal * 100));

    document.getElementById('goal-progress-text').textContent = `${total} / ${goal}`;
    document.getElementById('goal-bar-fill').style.width = `${pct}%`;
  }

  _renderStats() {
    const stats = this.store.get('todayStats') || { letters: 0, words: 0, review: 0 };
    document.getElementById('stat-letters').textContent = stats.letters;
    document.getElementById('stat-words').textContent   = stats.words;
    document.getElementById('stat-review').textContent  = stats.review;
  }

  _renderReviewQueue() {
    const reviewQueue = this.store.get('reviewQueue') || [];
    const badge = document.getElementById('review-count-badge');
    const preview = document.getElementById('review-queue-preview');
    const btn = document.getElementById('btn-start-review');
    const btnSub = document.getElementById('review-btn-sub');

    badge.textContent = reviewQueue.length;

    if (reviewQueue.length === 0) {
      preview.innerHTML = `<div style="font-size:13px;color:var(--text3)">복습할 항목이 없어요 🎉</div>`;
      btn.disabled = true;
      btnSub.textContent = '복습할 항목이 없어요';
      return;
    }

    // 미리보기: 최대 8개 칩
    const preview8 = reviewQueue.slice(0, 8);
    preview.innerHTML = preview8.map(id => {
      const word = words.find(w => w.id === id);
      return word ? `<span class="review-chip">${word.thai}</span>` : '';
    }).join('') + (reviewQueue.length > 8
      ? `<span class="review-chip" style="color:var(--text3)">+${reviewQueue.length - 8}</span>`
      : '');

    btn.disabled = false;
    btnSub.textContent = `${reviewQueue.length}개 복습하기`;
  }

  _bindReviewBtn() {
    document.getElementById('btn-start-review').addEventListener('click', () => {
      this.wordsModule.startReview();
    });
  }

  _bindRestartBtn() {
    document.getElementById('btn-restart-streak').addEventListener('click', async () => {
      await this.store.restartStreak();
      this._renderStreak();
    });
  }
}
