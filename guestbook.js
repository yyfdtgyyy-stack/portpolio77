(()=>{
'use strict';
const $=id=>document.getElementById(id), feed=$('guest-feed'), status=$('guest-status'), adminStatus=$('admin-status');
const cfg=window.PORTFOLIO_FIREBASE_CONFIG, owner=window.PORTFOLIO_ADMIN_UID;
const ready=cfg && cfg.apiKey && !cfg.apiKey.startsWith('YOUR_') && owner && !owner.startsWith('YOUR_');
if(!ready){feed.innerHTML='<div class="empty-feed">방명록 연결 준비 중입니다. 운영자가 Firebase 설정을 완료하면 메시지를 작성할 수 있습니다.</div>';$('guest-submit').disabled=true;adminStatus.textContent='Firebase 설정이 필요합니다. README를 확인하세요.';return;}
let db,auth,isAdmin=false,entries=[];
try{firebase.initializeApp(cfg);db=firebase.firestore();auth=firebase.auth();}catch(e){feed.textContent='연결 설정을 확인해 주세요.';return;}
const showStatus=(el,msg)=>{el.textContent=msg;};
const fmt=ts=>ts&&ts.toDate?ts.toDate().toLocaleDateString('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit'}):'방금 전';
const el=(tag,cls,content)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x;};
const btn=(label,handler)=>{const b=el('button','small-button',label);b.type='button';b.addEventListener('click',handler);return b;};
function render(){feed.replaceChildren();$('guest-count').textContent=`${entries.length} NOTES`;
 if(!entries.length){feed.append(el('div','empty-feed','아직 등록된 메시지가 없습니다. 첫 번째 메시지를 남겨주세요.'));return;}
 for(const item of entries){const d=item.data, article=el('article','guest-entry'), head=el('div','guest-entry-head');head.append(el('strong','',d.name),el('time','',fmt(d.createdAt)));article.append(head,el('p','message',d.message));
 if(d.reply){const r=el('div','guest-reply');r.append(el('strong','','TAEYOON / REPLY'),el('p','',d.reply));article.append(r);}
 if(isAdmin){const actions=el('div','admin-actions');actions.append(btn(d.reply?'답글 수정':'답글 작성',()=>editReply(item,article)),btn('글 삭제',()=>removeEntry(item)));article.append(actions);}
 feed.append(article);}}
function editReply(item,article){article.querySelector('.reply-editor')?.remove();const area=el('div','reply-editor'),input=el('textarea');input.maxLength=1000;input.value=item.data.reply||'';input.setAttribute('aria-label','관리자 답글');const save=btn('답글 저장',async()=>{const reply=input.value.trim();if(reply.length>1000)return;save.disabled=true;try{await db.collection('guestbook').doc(item.id).update({reply, repliedAt:firebase.firestore.FieldValue.serverTimestamp()});showStatus(adminStatus,'답글이 저장되었습니다.');}catch(e){showStatus(adminStatus,'답글 저장 실패: 권한과 설정을 확인하세요.');}finally{save.disabled=false;}});area.append(input,save,btn('취소',()=>area.remove()));article.append(area);input.focus();}
async function removeEntry(item){if(!confirm('이 메시지를 영구 삭제할까요?'))return;try{await db.collection('guestbook').doc(item.id).delete();showStatus(adminStatus,'메시지를 삭제했습니다.');}catch(e){showStatus(adminStatus,'삭제 실패: 관리자 권한을 확인하세요.');}}
$('guest-form').addEventListener('submit',async e=>{e.preventDefault();if($('guest-website').value)return;const name=$('guest-name').value.trim(),message=$('guest-message').value.trim();if(!name||!message||name.length>30||message.length>1000){showStatus(status,'이름(30자 이하)과 메시지(1000자 이하)를 확인해 주세요.');return;}const b=$('guest-submit');b.disabled=true;showStatus(status,'등록 중입니다...');try{await db.collection('guestbook').add({name,message,reply:'',createdAt:firebase.firestore.FieldValue.serverTimestamp(),repliedAt:null});$('guest-message').value='';showStatus(status,'메시지가 등록되었습니다.');}catch(e){showStatus(status,'등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');}finally{b.disabled=false;}});
$('admin-login').addEventListener('submit',async(e)=>{e.preventDefault();const loginButton=$('admin-signin');loginButton.disabled=true;try{await auth.signInWithEmailAndPassword($('admin-email').value.trim(),$('admin-password').value);$('admin-password').value='';}catch(e){showStatus(adminStatus,'로그인 실패: 이메일, 비밀번호 또는 인증 설정을 확인하세요.');}finally{loginButton.disabled=false;}});
$('admin-signout').addEventListener('click',()=>auth.signOut());
auth.onAuthStateChanged(user=>{isAdmin=!!user&&user.uid===owner;if(isAdmin)$('owner-access').open=true;$('admin-login').hidden=!!user;$('admin-session').hidden=!user;$('admin-label').textContent=isAdmin?'관리자 로그인됨':'이 계정은 관리자 권한이 없습니다.';showStatus(adminStatus,user&&!isAdmin?'관리자 UID가 일치하지 않습니다.':'');render();});
db.collection('guestbook').orderBy('createdAt','desc').limit(50).onSnapshot(snapshot=>{entries=snapshot.docs.map(doc=>({id:doc.id,data:doc.data()}));render();},()=>{feed.replaceChildren(el('div','empty-feed','메시지를 불러오지 못했습니다. Firestore 규칙 및 설정을 확인하세요.'));});
})();