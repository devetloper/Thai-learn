// modules/store.js — Firebase auth + Firestore data layer

import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js';

export class Store {
  constructor(db, userId) {
    this.db = db;
    this.userId = userId;
    this.cache = null;
    this._ref = doc(db, 'users', userId);
  }

  // 기본 데이터 구조
  _defaults() {
    return {
      streak: 0,
      lastStudyDate: null,
      streakBroken: false,
      todayStats: { letters: 0, words: 0, review: 0 },
      studyDates: [],          // 'YYYY-MM-DD' 배열 (최근 35일)
      learnedLetters: [],      // consonant char 배열
      missedLetters: [],       // 틀린 자음 char 배열
      learnedWords: [],        // word id 배열
      missedWords: [],         // 틀린 단어 id 배열 (복습 큐)
      reviewQueue: [],         // 오늘 복습 큐 (최대 20개)
    };
  }

  async load() {
    try {
      const snap = await getDoc(this._ref);
      if (snap.exists()) {
        this.cache = { ...this._defaults(), ...snap.data() };
      } else {
        this.cache = this._defaults();
        await setDoc(this._ref, this.cache);
      }
      this._checkStreak();
      return this.cache;
    } catch (e) {
      console.error('Store.load error:', e);
      this.cache = this._defaults();
      return this.cache;
    }
  }

  // 오늘 날짜 문자열
  _today() {
    return new Date().toISOString().slice(0, 10);
  }

  // 스트릭 체크: 마지막 학습일로부터 오늘까지의 간격 확인
  _checkStreak() {
    const today = this._today();
    const last = this.cache.lastStudyDate;
    if (!last) return;

    const diff = Math.floor(
      (new Date(today) - new Date(last)) / 86400000
    );

    if (diff === 0) {
      // 오늘 이미 학습함, OK
    } else if (diff === 1) {
      // 어제 학습함, 스트릭 유지 (오늘 학습 시 증가)
    } else if (diff > 1) {
      // 스트릭 끊김
      this.cache.streakBroken = true;
    }
  }

  get(key) {
    return this.cache?.[key];
  }

  async save(updates) {
    if (!this.cache) return;
    Object.assign(this.cache, updates);
    try {
      await updateDoc(this._ref, { ...updates, updatedAt: serverTimestamp() });
    } catch {
      // Offline fallback: 나중에 재시도
      setTimeout(() => this.save(updates), 5000);
    }
  }

  // 학습 완료 기록 (하루 첫 5개 달성 시 스트릭 증가)
  async recordStudy(type) {
    // type: 'letter' | 'word' | 'review'
    const today = this._today();
    const stats = { ...this.cache.todayStats };

    if (type === 'letter')  stats.letters++;
    if (type === 'word')    stats.words++;
    if (type === 'review')  stats.review++;

    const totalToday = stats.letters + stats.words + stats.review;
    const updates = { todayStats: stats };

    // 오늘 첫 학습 또는 목표 달성
    if (this.cache.lastStudyDate !== today) {
      const last = this.cache.lastStudyDate;
      const diff = last ? Math.floor(
        (new Date(today) - new Date(last)) / 86400000
      ) : 999;

      let newStreak = this.cache.streak;
      if (diff === 1) newStreak++;
      else if (diff > 1) newStreak = 1; // 새로 시작

      updates.streak = newStreak;
      updates.lastStudyDate = today;
      updates.streakBroken = false;

      // studyDates 갱신 (최근 35일만 유지)
      const dates = [...(this.cache.studyDates || [])];
      if (!dates.includes(today)) {
        dates.push(today);
        if (dates.length > 35) dates.shift();
      }
      updates.studyDates = dates;
    }

    await this.save(updates);
    return this.cache;
  }

  // 자음 학습 완료 표시
  async markLetterLearned(char) {
    const learned = [...(this.cache.learnedLetters || [])];
    if (!learned.includes(char)) {
      learned.push(char);
      await this.save({ learnedLetters: learned });
      await this.recordStudy('letter');
    }
  }

  // 자음 틀림 표시
  async markLetterMissed(char) {
    const missed = [...(this.cache.missedLetters || [])];
    if (!missed.includes(char)) {
      missed.push(char);
      await this.save({ missedLetters: missed });
    }
  }

  // 자음 틀림 해제
  async clearLetterMissed(char) {
    const missed = (this.cache.missedLetters || []).filter(c => c !== char);
    await this.save({ missedLetters: missed });
  }

  // 단어 알았어요
  async markWordKnown(wordId) {
    const learned = [...(this.cache.learnedWords || [])];
    const missed = (this.cache.missedWords || []).filter(id => id !== wordId);
    const queue = (this.cache.reviewQueue || []).filter(id => id !== wordId);
    if (!learned.includes(wordId)) learned.push(wordId);
    await this.save({ learnedWords: learned, missedWords: missed, reviewQueue: queue });
    await this.recordStudy('word');
  }

  // 단어 모르겠어요 → 복습 큐에 추가
  async markWordMissed(wordId) {
    const missed = [...(this.cache.missedWords || [])];
    let queue = [...(this.cache.reviewQueue || [])];
    if (!missed.includes(wordId)) missed.push(wordId);
    if (!queue.includes(wordId)) {
      queue.push(wordId);
      if (queue.length > 20) queue = queue.slice(-20); // 최대 20개
    }
    await this.save({ missedWords: missed, reviewQueue: queue });
    await this.recordStudy('word');
  }

  // 복습 완료
  async markReviewDone(wordId) {
    const queue = (this.cache.reviewQueue || []).filter(id => id !== wordId);
    const missed = (this.cache.missedWords || []).filter(id => id !== wordId);
    await this.save({ reviewQueue: queue, missedWords: missed });
    await this.recordStudy('review');
  }

  // 스트릭 리셋 후 다시 시작
  async restartStreak() {
    await this.save({ streak: 0, streakBroken: false });
  }
}
