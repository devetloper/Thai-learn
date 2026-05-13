// app.js — 앱 초기화, 탭 라우팅, 인증 연결

import { TTS }           from './modules/tts.js';
import { Store }         from './modules/store.js';
import { LettersModule } from './modules/letters.js';
import { WordsModule }   from './modules/words.js';
import { TodayModule }   from './modules/today.js';

export default class App {
  constructor() {
    this._waitForFirebase();
  }

  _waitForFirebase() {
    const check = () => {
      if (window.__firebase) {
        this._init();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  }

  async _init() {
    const { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged } = window.__firebase;

    // TTS 초기화
    this.tts = new TTS();
    await this.tts.init();

    // 인증 상태 감지
    onAuthStateChanged(auth, async user => {
      if (user) {
        await this._startApp(db, user);
      } else {
        this._showLogin();
      }
    });

    // 로그인 버튼
    document.getElementById('btn-google-login').addEventListener('click', async () => {
      document.getElementById('login-loading').classList.remove('hidden');
      document.getElementById('btn-google-login').classList.add('hidden');
      try {
        await signInWithPopup(auth, provider);
      } catch (e) {
        document.getElementById('login-loading').classList.add('hidden');
        document.getElementById('btn-google-login').classList.remove('hidden');
        console.error('Login error:', e);
      }
    });

    // 로그아웃 버튼
    document.getElementById('btn-logout').addEventListener('click', async () => {
      await signOut(auth);
    });
  }

  _showLogin() {
    document.getElementById('screen-login').classList.remove('hidden');
    document.getElementById('screen-login').classList.add('active');
    document.getElementById('screen-app').classList.add('hidden');
  }

  async _startApp(db, user) {
    // 데이터 로드
    this.store = new Store(db, user.uid);
    await this.store.load();

    // 모듈 초기화
    this.wordsModule   = new WordsModule(this.store, this.tts);
    this.lettersModule = new LettersModule(this.store, this.tts);
    this.todayModule   = new TodayModule(this.store, this.wordsModule);

    // 초기 렌더
    this.lettersModule.render();
    this.wordsModule.render();
    this.todayModule.render();

    // 탭 라우팅
    this._bindTabs();

    // 화면 전환
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('screen-app').classList.remove('hidden');
  }

  _bindTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = {
      letters: document.getElementById('tab-letters'),
      words:   document.getElementById('tab-words'),
      today:   document.getElementById('tab-today'),
    };

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.entries(contents).forEach(([key, el]) => {
          el.classList.toggle('hidden', key !== target);
          el.classList.toggle('active', key === target);
        });

        // 탭 전환 시 재렌더 (진도 최신화)
        if (target === 'letters') this.lettersModule.render();
        if (target === 'words')   this.wordsModule.render();
        if (target === 'today')   this.todayModule.render();
      });
    });

    // 모달 닫힌 후 진도 업데이트
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
          this.todayModule.render();
        }
      });
    });
  }
}
