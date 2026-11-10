TAEYOON PORTFOLIO — GITHUB PAGES + GUESTBOOK (2026)

구성
- index.html / about.html / projects.html / bus-shelter.html / door-lock.html / exhibition.html / contact.html / guestbook.html
- style.css / script.js / guestbook.js / firebase-config.js / firestore.rules
- 기존 images/ 폴더는 별도로 복사해야 합니다. 제공된 업로드에 이미지 원본이 없습니다.

작동 방식
- 방문자는 계정 없이 이름/메시지를 공개 방명록에 게시합니다.
- 관리자는 이메일/비밀번호로 로그인하여 공개 글에 답글을 달거나 삭제할 수 있습니다.
- Firestore 규칙이 실제 쓰기 권한을 검증합니다. HTML에서 버튼을 숨기는 것만으로 보안을 구현하지 않습니다.
- GitHub Pages는 정적 호스팅입니다. Firebase 설정을 하지 않으면 게시판은 저장/표시되지 않습니다.

설치 단계
1. https://console.firebase.google.com/ 에서 프로젝트를 만듭니다.
2. 프로젝트 설정 > 내 앱에서 웹 앱을 등록하고 Firebase config(apiKey, authDomain, projectId, appId)를 확인합니다.
3. Build > Firestore Database에서 데이터베이스를 생성합니다.
4. Build > Authentication > Sign-in method에서 Email/Password를 활성화합니다.
5. Authentication > Users에서 관리자 사용자 1명을 생성합니다. UID를 복사합니다.
6. firebase-config.js의 YOUR_... 설정값을 실제 값으로 변경합니다. UID는 관리자 계정의 UID여야 합니다.
7. firestore.rules에서 REPLACE_WITH_ADMIN_UID를 같은 UID로 교체합니다. Firestore > Rules에 붙여넣고 Publish를 누릅니다.
8. Authentication > Settings > Authorized domains에서 실제 GitHub Pages 도메인을 확인/추가합니다(로그인에 필요한 경우).
9. GitHub 저장소 루트에 HTML/CSS/JS와 기존 images/ 폴더를 업로드합니다. GitHub Settings > Pages에서 배포합니다.
10. 배포 URL의 guestbook.html에서 익명 메시지를 등록하고, 하단 OWNER ACCESS를 열어 관리자 로그인을 테스트합니다.
11. 관리자 계정이 아닌 사용자로 답글 저장 및 삭제가 차단되는지도 확인합니다.

보안/운영 주의
- Firebase 웹 앱 config는 공개되어도 되지만 관리자 비밀번호, 서비스 계정 비밀키는 절대로 GitHub에 올리지 마세요.
- 관리자 UID는 비밀키가 아닙니다. 실제 접근 제어는 Firestore 규칙이 수행합니다.
- 익명 공개 쓰기는 스팸, 악성 게시물, 사용량 폭증 위험이 있습니다. 현재 코드는 기본 필드 검증만 포함하며 CAPTCHA, IP별 rate limit, 신고/승인 대기 기능은 포함하지 않습니다.
- 실제 공개 운영 전 Firebase App Check, 서버 측 rate limiting, 모니터링/알림 또는 승인제 도입을 권장합니다.
- 메시지는 공개됩니다. 개인정보와 비공개 문의는 이메일로 받으세요.
- Firebase 무료 할당량/과금 조건을 확인하고 예산 알림을 설정하세요.
- 기존 이미지가 없으면 이미지 파일 확인 안내가 표시됩니다.
