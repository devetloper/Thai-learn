// Thai consonants data
// group: 'mid' | 'high' | 'low'
// class affects tone calculation

export const consonants = [
  // ── MID CLASS (9자) ──────────────────────────────
  { char: 'ก', rtgs: 'k', name: 'ก ไก่', meaning: '닭', example: 'ไก่', exampleRtgs: 'kai', exampleMeaning: '닭', group: 'mid' },
  { char: 'จ', rtgs: 'ch/j', name: 'จ จาน', meaning: '접시', example: 'จาน', exampleRtgs: 'chan', exampleMeaning: '접시', group: 'mid' },
  { char: 'ด', rtgs: 'd', name: 'ด เด็ก', meaning: '어린이', example: 'เด็ก', exampleRtgs: 'dek', exampleMeaning: '어린이', group: 'mid' },
  { char: 'ต', rtgs: 't', name: 'ต เต่า', meaning: '거북이', example: 'เต่า', exampleRtgs: 'tao', exampleMeaning: '거북이', group: 'mid' },
  { char: 'บ', rtgs: 'b', name: 'บ ใบไม้', meaning: '잎', example: 'ใบไม้', exampleRtgs: 'bai mai', exampleMeaning: '나뭇잎', group: 'mid' },
  { char: 'ป', rtgs: 'p', name: 'ป ปลา', meaning: '물고기', example: 'ปลา', exampleRtgs: 'pla', exampleMeaning: '물고기', group: 'mid' },
  { char: 'อ', rtgs: '-(silent)', name: 'อ อ่าง', meaning: '대야', example: 'อ่าง', exampleRtgs: 'ang', exampleMeaning: '대야', group: 'mid' },
  { char: 'ฎ', rtgs: 'd', name: 'ฎ ชฎา', meaning: '왕관', example: 'ชฎา', exampleRtgs: 'cha-da', exampleMeaning: '태국 왕관', group: 'mid' },
  { char: 'ฏ', rtgs: 't', name: 'ฏ ปฏัก', meaning: '창', example: 'ปฏัก', exampleRtgs: 'pa-tak', exampleMeaning: '창', group: 'mid' },

  // ── HIGH CLASS (11자) ─────────────────────────────
  { char: 'ข', rtgs: 'kh', name: 'ข ไข่', meaning: '달걀', example: 'ไข่', exampleRtgs: 'khai', exampleMeaning: '달걀', group: 'high' },
  { char: 'ฃ', rtgs: 'kh', name: 'ฃ ขวด', meaning: '병', example: 'ขวด', exampleRtgs: 'khuat', exampleMeaning: '병', group: 'high' },
  { char: 'ฉ', rtgs: 'ch', name: 'ฉ ฉิ่ง', meaning: '심벌즈', example: 'ฉิ่ง', exampleRtgs: 'ching', exampleMeaning: '심벌즈', group: 'high' },
  { char: 'ถ', rtgs: 'th', name: 'ถ ถุง', meaning: '가방', example: 'ถุง', exampleRtgs: 'thung', exampleMeaning: '가방', group: 'high' },
  { char: 'ผ', rtgs: 'ph', name: 'ผ ผึ้ง', meaning: '꿀벌', example: 'ผึ้ง', exampleRtgs: 'phueng', exampleMeaning: '꿀벌', group: 'high' },
  { char: 'ฝ', rtgs: 'f', name: 'ฝ ฝา', meaning: '뚜껑', example: 'ฝา', exampleRtgs: 'fa', exampleMeaning: '뚜껑', group: 'high' },
  { char: 'ศ', rtgs: 's', name: 'ศ ศาลา', meaning: '정자', example: 'ศาลา', exampleRtgs: 'sa-la', exampleMeaning: '정자', group: 'high' },
  { char: 'ษ', rtgs: 's', name: 'ษ ฤๅษี', meaning: '신선', example: 'ฤๅษี', exampleRtgs: 'rue-si', exampleMeaning: '신선', group: 'high' },
  { char: 'ส', rtgs: 's', name: 'ส เสือ', meaning: '호랑이', example: 'เสือ', exampleRtgs: 'suea', exampleMeaning: '호랑이', group: 'high' },
  { char: 'ห', rtgs: 'h', name: 'ห หีบ', meaning: '상자', example: 'หีบ', exampleRtgs: 'hip', exampleMeaning: '상자', group: 'high' },
  { char: 'ฐ', rtgs: 'th', name: 'ฐ ฐาน', meaning: '기단', example: 'ฐาน', exampleRtgs: 'than', exampleMeaning: '기단/받침', group: 'high' },

  // ── LOW CLASS (24자) ──────────────────────────────
  { char: 'ค', rtgs: 'kh', name: 'ค ควาย', meaning: '물소', example: 'ควาย', exampleRtgs: 'khwai', exampleMeaning: '물소', group: 'low' },
  { char: 'ฅ', rtgs: 'kh', name: 'ฅ คน', meaning: '사람', example: 'คน', exampleRtgs: 'khon', exampleMeaning: '사람', group: 'low' },
  { char: 'ง', rtgs: 'ng', name: 'ง งู', meaning: '뱀', example: 'งู', exampleRtgs: 'ngu', exampleMeaning: '뱀', group: 'low' },
  { char: 'ช', rtgs: 'ch', name: 'ช ช้าง', meaning: '코끼리', example: 'ช้าง', exampleRtgs: 'chang', exampleMeaning: '코끼리', group: 'low' },
  { char: 'ซ', rtgs: 's', name: 'ซ โซ่', meaning: '사슬', example: 'โซ่', exampleRtgs: 'so', exampleMeaning: '사슬', group: 'low' },
  { char: 'ญ', rtgs: 'y', name: 'ญ หญิง', meaning: '여자', example: 'หญิง', exampleRtgs: 'ying', exampleMeaning: '여자', group: 'low' },
  { char: 'ณ', rtgs: 'n', name: 'ณ เณร', meaning: '사미승', example: 'เณร', exampleRtgs: 'nen', exampleMeaning: '사미승', group: 'low' },
  { char: 'น', rtgs: 'n', name: 'น หนู', meaning: '쥐', example: 'หนู', exampleRtgs: 'nu', exampleMeaning: '쥐', group: 'low' },
  { char: 'พ', rtgs: 'ph', name: 'พ พาน', meaning: '제기', example: 'พาน', exampleRtgs: 'phan', exampleMeaning: '제기(그릇)', group: 'low' },
  { char: 'ฟ', rtgs: 'f', name: 'ฟ ฟัน', meaning: '이(치아)', example: 'ฟัน', exampleRtgs: 'fan', exampleMeaning: '이(치아)', group: 'low' },
  { char: 'ภ', rtgs: 'ph', name: 'ภ สำเภา', meaning: '범선', example: 'สำเภา', exampleRtgs: 'sam-phao', exampleMeaning: '범선', group: 'low' },
  { char: 'ม', rtgs: 'm', name: 'ม ม้า', meaning: '말', example: 'ม้า', exampleRtgs: 'ma', exampleMeaning: '말', group: 'low' },
  { char: 'ย', rtgs: 'y', name: 'ย ยักษ์', meaning: '거인', example: 'ยักษ์', exampleRtgs: 'yak', exampleMeaning: '거인/도깨비', group: 'low' },
  { char: 'ร', rtgs: 'r', name: 'ร เรือ', meaning: '배', example: 'เรือ', exampleRtgs: 'ruea', exampleMeaning: '배(선박)', group: 'low' },
  { char: 'ล', rtgs: 'l', name: 'ล ลิง', meaning: '원숭이', example: 'ลิง', exampleRtgs: 'ling', exampleMeaning: '원숭이', group: 'low' },
  { char: 'ว', rtgs: 'w', name: 'ว แหวน', meaning: '반지', example: 'แหวน', exampleRtgs: 'waen', exampleMeaning: '반지', group: 'low' },
  { char: 'ฌ', rtgs: 'ch', name: 'ฌ เฌอ', meaning: '나무', example: 'เฌอ', exampleRtgs: 'choe', exampleMeaning: '나무', group: 'low' },
  { char: 'ฑ', rtgs: 'th/d', name: 'ฑ มณโฑ', meaning: '여왕', example: 'มณโฑ', exampleRtgs: 'mon-tho', exampleMeaning: '라마야나 여왕', group: 'low' },
  { char: 'ฒ', rtgs: 'th', name: 'ฒ ผู้เฒ่า', meaning: '노인', example: 'ผู้เฒ่า', exampleRtgs: 'phu-thao', exampleMeaning: '노인', group: 'low' },
  { char: 'ธ', rtgs: 'th', name: 'ธ ธง', meaning: '깃발', example: 'ธง', exampleRtgs: 'thong', exampleMeaning: '깃발', group: 'low' },
  { char: 'ฬ', rtgs: 'l', name: 'ฬ จุฬา', meaning: '연', example: 'จุฬา', exampleRtgs: 'chu-la', exampleMeaning: '연(凧)', group: 'low' },
  { char: 'ฮ', rtgs: 'h', name: 'ฮ นกฮูก', meaning: '올빼미', example: 'นกฮูก', exampleRtgs: 'nok-huk', exampleMeaning: '올빼미', group: 'low' },
  { char: 'ฆ', rtgs: 'kh', name: 'ฆ ระฆัง', meaning: '종', example: 'ระฆัง', exampleRtgs: 'ra-khang', exampleMeaning: '종', group: 'low' },
  { char: 'ฯ', rtgs: '-', name: 'ฦ ฦๅ', meaning: '(폐용)', example: 'ฦๅ', exampleRtgs: 'lue', exampleMeaning: '(현대에 미사용)', group: 'low' },
];

export const consonantGroups = {
  mid:  { label: '중성자음', labelThai: 'อักษรกลาง', color: '#3B82F6', count: 9 },
  high: { label: '고성자음', labelThai: 'อักษรสูง',  color: '#8B5CF6', count: 11 },
  low:  { label: '저성자음', labelThai: 'อักษรต่ำ',  color: '#10B981', count: 24 },
};
