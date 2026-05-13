// modules/tts.js — TTS with Thai language support + fallback

export class TTS {
  constructor() {
    this.supported = false;
    this.thaiVoice = null;
    this.checked = false;
  }

  async init() {
    if (this.checked) return;
    this.checked = true;

    if (!('speechSynthesis' in window)) {
      this.supported = false;
      return;
    }

    // 음성 목록 로드 (비동기)
    await this._loadVoices();
    this.supported = this.thaiVoice !== null;
  }

  _loadVoices() {
    return new Promise(resolve => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.thaiVoice = voices.find(v => v.lang.startsWith('th')) || null;
        resolve();
        return;
      }
      // 일부 브라우저는 비동기로 로드
      window.speechSynthesis.onvoiceschanged = () => {
        const v = window.speechSynthesis.getVoices();
        this.thaiVoice = v.find(voice => voice.lang.startsWith('th')) || null;
        resolve();
      };
      // 2초 타임아웃
      setTimeout(() => resolve(), 2000);
    });
  }

  speak(text) {
    if (!this.supported || !this.thaiVoice) return false;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = this.thaiVoice;
    utter.lang = 'th-TH';
    utter.rate = 0.85;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
    return true;
  }

  // TTS 버튼 렌더링 헬퍼
  renderBtn(text, label = '발음 듣기') {
    if (this.supported) {
      return `
        <button class="btn-tts" onclick="window.__tts.speak('${text.replace(/'/g, "\\'")}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          ${label}
        </button>`;
    }
    return `<div class="tts-unavailable">⚠ 이 기기에서는 음성 지원이 안 돼요</div>`;
  }
}
