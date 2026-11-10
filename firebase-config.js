// Firebase Console > 프로젝트 설정 > 내 앱 > 웹 앱 구성값을 입력하세요.
// 이 값은 공개 설정이며 비밀번호가 아닙니다. 보안은 firestore.rules로 적용합니다.
window.PORTFOLIO_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
// Firebase Authentication > 사용자 UID (이메일 주소가 아니라 UID)
window.PORTFOLIO_ADMIN_UID = "YOUR_ADMIN_UID";
