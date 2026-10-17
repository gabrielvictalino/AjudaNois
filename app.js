const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seed={customRooms:[],role:'Monitor',rooms:['alg'],materials:[{id:1,title:'Guia de estruturas de repetição',topic:'Unidade 02 · Estruturas de controle',desc:'Resumo da aula, exemplos resolvidos e exercícios para praticar.',name:'guia-repeticao.txt',content:'Material demonstrativo: estruturas de repetição\nfor: quantidade conhecida\nwhile: repetição por condição.'},{id:2,title:'Lista de exercícios · Introdução',topic:'Unidade 01 · Primeiros passos',desc:'Revisão dos conceitos fundamentais de algoritmos.',name:'lista-introducao.txt',content:'Exercícios demonstrativos\n1. Leia dois valores e calcule sua soma.\n2. Calcule a média de três notas.'}],lessons:[{id:1,title:'Laços de repetição na prática',date:'2026-10-20',time:'14:00',duration:2,place:'Laboratório 03',content:'Laços for e while, condições de parada e resolução de exercícios.',status:'Agendada'},{id:2,title:'Resolvendo problemas com vetores',date:'2026-10-22',time:'14:00',duration:2,place:'Sala virtual',content:'Declaração, acesso e percursos em vetores.',status:'Agendada'}],activities:[{id:1,title:'Lista 03 · Estruturas de repetição',desc:'Escreva um algoritmo que leia cinco números e exiba a soma dos valores pares. Explique a condição utilizada.',deadline:'2026-10-25',mode:'Durante a aula',response:'',grade:null,feedback:''},{id:2,title:'Lista 02 · Condicionais',desc:'Crie um algoritmo que verifique se um número é par ou ímpar.',deadline:'2026-10-10',mode:'Extraclasse',response:'Leia n. Se n % 2 = 0, escreva "Par"; senão, escreva "Ímpar".',grade:'9,0',feedback:'Muito bem! A lógica está correta. Na próxima atividade, detalhe as variáveis.'}],attendance:[{title:'Introdução aos algoritmos',date:'2026-10-06',present:true,evidence:'Resposta enviada na atividade de revisão'},{title:'Estruturas condicionais',date:'2026-10-08',present:true,evidence:'Participação registrada no exercício da aula'},{title:'Prática de condicionais',date:'2026-10-13',present:false,evidence:'Nenhuma interação registrada'}],interacted:false,messages:[{id:1,role:'Professor',name:'Profa. Helena',text:'Olá, Lucas! Podemos revisar os laços de repetição na próxima monitoria?',time:'09:30'},{id:2,role:'Monitor',name:'Lucas Costa',text:'Claro, professora! Preparei exemplos e uma lista para a turma.',time:'09:34'}],notices:[{id:1,title:'Material novo para a próxima aula',body:'O guia de estruturas de repetição já está disponível na sala. Dê uma olhada antes da monitoria!',target:'Toda a turma',date:'16 out. 2026'},{id:2,title:'Vamos revisar juntos?',body:'Ana, reserve um momento para concluir a lista de condicionais. Estou disponível na próxima monitoria.',target:'Ana Souza',date:'15 out. 2026'}],signature:{name:'Marina Oliveira',position:'Coordenadora de monitorias',image:''},certificates:[{id:1,term:'2026.1',course:'Introdução à programação',hours:40,date:'2026-07-15',status:'Disponível',code:'AN-2026-001',signer:'Marina Oliveira',position:'Coordenadora de monitorias',image:''}],selections:[{id:1,title:'Seleção de monitores · 2027.1',discipline:'Algoritmos e programação',start:'2026-11-01',end:'2026-11-20',slots:2,desc:'Seleção de estudantes para apoiar a monitoria de Algoritmos e programação.'}]};
let state;try{state=JSON.parse(localStorage.getItem('ajudanois-v1'))||structuredClone(seed)}catch{state=structuredClone(seed)}
let page=location.hash.slice(1)||'inicio', activityFilter='Todas',trackingFilter='Todos',chatRoom='alg',materialQuery='',materialTopic='Todos',selectedId=null;
const names={Monitor:'Lucas Costa',Aluno:'Ana Souza',Professor:'Helena Martins','Coordenação':'Marina Oliveira'}, courseNames={alg:'Algoritmos e programação',calc:'Cálculo I'};
state.customRooms=state.customRooms||[];state.customRooms.forEach(r=>courseNames[r.key]=r.title);let materialRoom='alg';
const routes={inicio:['Visão geral','▦',null],salas:['Minhas salas','▱',8],materiais:['Sala de materiais','▤',6],agenda:['Agenda de aulas','▦',12],presenca:['Minha frequência','◉',9],atividades:['Minhas atividades','✓',10],acompanhamento:['Acompanhamento','▥',13],conversas:['Conversas','▧',3],avisos:['Avisos','♧',15],certificados:['Meus certificados','◇',14],assinatura:['Assinatura','✎',16],emissao:['Emissão de certificados','◇',17],selecao:['Processos seletivos','▣',22],guia:['Guia de demonstração','◈',null]};
const permissions={Monitor:['inicio','materiais','agenda','acompanhamento','conversas','avisos','certificados'],Aluno:['inicio','salas','materiais','agenda','presenca','atividades','avisos'],Professor:['inicio','materiais','conversas'],'Coordenação':['inicio','assinatura','emissao','selecao']};
const save=()=>{try{localStorage.setItem('ajudanois-v1',JSON.stringify(state))}catch{toast('Não foi possível salvar no navegador. Evite arquivos grandes.')}};
const id=()=>Date.now()+Math.floor(Math.random()*1000),isStaff=()=>['Monitor','Professor'].includes(state.role),can=p=>p==='guia'||permissions[state.role].includes(p),date=v=>new Date(v+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}),fullDate=v=>new Date(v+'T12:00:00').toLocaleDateString('pt-BR'),demoDate='2026-10-16';
function toast(s){$('#toast').textContent=s;$('#toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').style.display='none',3800)}
function navigate(p){page=p;location.hash=p;render();document.body.classList.remove('menu-open');window.scrollTo(0,0)}
window.addEventListener('hashchange',()=>{page=location.hash.slice(1)||'inicio';render()});
$('#role').value=state.role;$('#role').onchange=e=>{state.role=e.target.value;save();navigate('inicio')};
function switchTo(role,p){state.role=role;$('#role').value=role;save();navigate(p)}
function pageTop(title,desc,action='',label='Seu espaço de aprendizagem'){return `<div class="page-top"><div><div class="eyebrow">${label}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function btn(text,fn,type=''){return `<button type="button" class="btn ${type}" onclick="${fn}">${text}</button>`}
function tag(s,c=''){return `<span class="tag ${c}">${esc(s)}</span>`}
function empty(s){return `<div class="empty">${s}</div>`}
function render(){if(!can(page))page='inicio';$('#crumb').textContent=routes[page]?.[0]||'Visão geral';$('#avatar').textContent=names[state.role].split(' ').map(s=>s[0]).join('');$('#nav').innerHTML=permissions[state.role].map(p=>`<a href="#${p}" class="${p===page?'active':''}"><span class="ico">${routes[p][1]}</span>${routes[p][0]}${p==='avisos'?'<span class="count">'+state.notices.length+'</span>':''}</a>`).join('');const views={inicio:home,salas:rooms,materiais:materials,agenda:agenda,presenca:attendance,atividades:activities,acompanhamento:tracking,conversas:chat,avisos:notices,certificados:certificates,assinatura:signature,emissao:issuance,selecao:selections,guia:guide};$('#main').innerHTML=(views[page]||home)();}
function stat(label,value,note,ico){return `<div class="stat"><div class="stat-top">${label}<span class="stat-icon">${ico}</span></div><strong>${value}</strong><small>${note}</small></div>`}
function art(){return '<div class="hero-art" aria-hidden="true"><div class="paper"><span style="font-size:24px;color:#789b70">✎</span><div class="line"></div><div class="line"></div><div class="line"></div></div><span class="star">✦</span><span class="circle">✓</span></div>'}
function joinForm(){modal('Entrar em uma sala',`<div class="tabs"><button class="selected" type="button" onclick="joinForm()">Por código</button><button type="button" onclick="manualJoin()">Entrada manual</button></div><form onsubmit="event.preventDefault();joinCode(this)"><label class="label">Código da sala</label><input name="code" required placeholder="Ex.: AJUDA26" autocomplete="off"><p class="muted">Peça o código ao professor da monitoria.</p><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Entrar na sala</button></div></form>`)}
function invite(){modal('Convite para monitoria',`<p>Olá, Ana! A professora Helena convidou você para a sala:</p><div class="card"><h3>Algoritmos e programação</h3><p class="muted">2026.2 · Monitor Lucas Costa</p></div><p class="muted">Exemplo de convite recebido por e-mail. Nenhum e-mail é enviado neste protótipo.</p><div class="actions">${btn('Aceitar convite',"join('alg')")}${btn('Agora não','closeModal()','secondary')}</div>`)}
function roomForm(){modal('Criar sala virtual',`<form onsubmit="event.preventDefault();saveRoom(this)"><label class="label">Nome da disciplina</label><input name="title" required><label class="label">Descrição da sala</label><textarea name="desc" required></textarea><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Criar sala</button></div></form>`)}
function filterMaterials(q){materialQuery=q;renderMaterialList()}
function renderMaterialList(){$('#material-list').innerHTML=materialCards()}
function materialCards(){return state.materials.filter(m=>(m.room||'alg')===materialRoom).filter(m=>(m.title+' '+m.desc).toLowerCase().includes(materialQuery.toLowerCase())&&(materialTopic==='Todos'||m.topic===materialTopic)).map(m=>`<article class="card"><div class="card-head"><span class="file-icon">▤</span>${tag(m.topic)}</div><h2>${esc(m.title)}</h2><p class="muted">${esc(m.desc)}</p><p class="muted">${esc(m.name)} · Publicado na sala</p><div class="actions">${btn('Visualizar',`materialView(${m.id})`,'secondary')}${btn('↓ Baixar',`downloadMaterial(${m.id})`)}${isStaff()?btn('Editar',`materialForm(${m.id})`,'ghost')+btn('Excluir',`deleteItem('materials',${m.id},'material')`,'ghost'):''}</div></article>`).join('')||empty('Nenhum material encontrado.')}
function materialForm(mid){let m=state.materials.find(x=>x.id===mid)||{};modal(mid?'Editar material':'Publicar material',`<form onsubmit="event.preventDefault();saveMaterial(this,${mid||0})"><label class="label">Título</label><input name="title" required value="${esc(m.title||'')}"><label class="label">Unidade / organização</label><input name="topic" required placeholder="Unidade 03 · Vetores" value="${esc(m.topic||'')}"><label class="label">Descrição</label><textarea name="desc" required>${esc(m.desc||'')}</textarea><label class="label">Arquivo ${mid?'(opcional para substituir)':''}</label><input type="file" name="file" ${mid?'':'required'}><p class="muted">Demonstração local: até 1 MB por arquivo.</p><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">${mid?'Salvar alterações':'Publicar material'}</button></div></form>`)}
function readFile(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
function downloadMaterial(mid){let m=state.materials.find(m=>m.id===mid);download(m.name,m.data||new Blob([m.content],{type:'text/plain;charset=utf-8'}));toast('Download do material iniciado.')}
function download(name,content){let url=typeof content==='string'?content:URL.createObjectURL(content);const a=document.createElement('a');a.href=url;a.download=name;a.click();if(typeof content!=='string')setTimeout(()=>URL.revokeObjectURL(url),1000)}
function lessonForm(lid){let l=state.lessons.find(x=>x.id===lid)||{date:'2026-10-23',time:'14:00',duration:2};modal(lid?'Editar aula':'Agendar uma nova aula',`<form onsubmit="event.preventDefault();saveLesson(this,${lid||0})"><label class="label">Título da aula</label><input name="title" required value="${esc(l.title||'')}"><div class="form-row"><div><label class="label">Data</label><input type="date" name="date" required value="${l.date}"></div><div><label class="label">Horário</label><input type="time" name="time" required value="${l.time}"></div></div><div class="form-row"><div><label class="label">Duração (horas)</label><input type="number" name="duration" min="0.5" step="0.5" max="8" required value="${l.duration}"></div><div><label class="label">Local ou link</label><input name="place" required value="${esc(l.place||'')}"></div></div><label class="label">Conteúdos</label><textarea name="content" required>${esc(l.content||'')}</textarea><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Salvar aula</button></div></form>`)}
function correctedDelivery(aid){let a=state.activities.find(x=>x.id===aid);modal('Entrega corrigida · Ana Souza',`<h3>${esc(a.title)}</h3><p>${esc(a.response)}</p><div class="banner">Nota: ${esc(a.grade)} / 10<br>${esc(a.feedback)}</div>`)}
function noticeForm(nid=0,target='Toda a turma'){let n=state.notices.find(x=>x.id===nid)||{target};modal(nid?'Editar aviso':'Criar um aviso',`<form onsubmit="event.preventDefault();saveNotice(this,${nid})"><label class="label">Destinatário</label><select name="target">${['Toda a turma','Ana Souza','Bruno Lima','Carla Mendes','Diego Santos'].map(t=>`<option ${t===n.target?'selected':''}>${t}</option>`).join('')}</select><label class="label">Título</label><input name="title" required value="${esc(n.title||'')}"><label class="label">Mensagem</label><textarea name="body" required>${esc(n.body||'')}</textarea><p class="muted">O aviso ficará disponível na área do aluno. Nenhuma mensagem externa será enviada.</p><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">${nid?'Salvar alterações':'Publicar aviso'}</button></div></form>`)}
function certificateHTML(c){return `<div class="certificate"><div class="eyebrow">AJUDANOIS · PROGRAMA DE MONITORIAS</div><h2>Certificado de monitoria</h2><p>Certificamos, para fins de demonstração, que</p><h3>Lucas Costa</h3><p>participou da monitoria de <strong>${esc(c.course)}</strong><br>no semestre ${esc(c.term)}, com carga horária de <strong>${c.hours} horas</strong>.</p><p>Emitido em ${fullDate(c.date)}</p>${c.image?`<img class="signature" src="${c.image}" alt="Assinatura cadastrada">`:`<div class="signature-text">${esc(c.signer)}</div>`}<p style="font-size:12px">${esc(c.signer)}<br>${esc(c.position)}</p><p style="font-size:10px">${esc(c.code)} · ${esc(c.status)}<br>MODELO DEMONSTRATIVO · SEM VALIDADE OFICIAL</p></div>`}
function signature(){return pageTop('Uma assinatura, muitas conquistas.','Gerencie a identificação usada nos certificados.',btn(state.signature?'Editar assinatura':'＋ Cadastrar assinatura','signatureForm()'),'Funcionalidade 16 · Coordenação')+(state.signature?`<div class="grid"><div class="card"><div class="card-head"><h2>Assinatura cadastrada</h2>${tag('Ativa','green')}</div>${state.signature.image?`<img class="signature" src="${state.signature.image}" alt="Assinatura cadastrada">`:`<div class="signature-text">${esc(state.signature.name)}</div>`}<p><strong>${esc(state.signature.name)}</strong><br><span class="muted">${esc(state.signature.position)}</span></p><div class="actions">${btn('Visualizar','signatureView()','secondary')}${btn('Excluir assinatura','deleteSignature()','danger')}</div></div><div class="card"><h2>Como ela aparece no certificado</h2><p class="muted">Nome, cargo e imagem da assinatura compõem o rodapé do documento. Na ausência de imagem, este protótipo exibe o nome em itálico.</p><div class="banner">Uma alteração vale para novas emissões e reemissões. Os modelos já emitidos preservam a assinatura utilizada naquele momento.</div></div></div>`:empty('Nenhuma assinatura cadastrada. Cadastre uma para habilitar a emissão de certificados.'))}
function signatureView(){let s=state.signature;modal('Visualizar assinatura',`<div class="certificate">${s.image?`<img class="signature" src="${s.image}" alt="Assinatura da coordenação">`:`<div class="signature-text">${esc(s.name)}</div>`}<p>${esc(s.name)}<br>${esc(s.position)}</p></div>`)}
function selectionView(sid){let s=state.selections.find(x=>x.id===sid);modal(s.title,`<p><strong>Disciplina:</strong> ${esc(s.discipline)}<br><strong>Vagas:</strong> ${s.slots}<br><strong>Período:</strong> ${fullDate(s.start)} a ${fullDate(s.end)}</p><p>${esc(s.desc)}</p>${btn('Atualizar processo',`selectionForm(${sid})`)}`)}
function selectionForm(sid){let s=state.selections.find(x=>x.id===sid)||{start:'2026-11-01',end:'2026-11-20',slots:2};modal(sid?'Atualizar processo seletivo':'Criar processo seletivo',`<form onsubmit="event.preventDefault();saveSelection(this,${sid||0})"><label class="label">Título</label><input name="title" required value="${esc(s.title||'')}"><label class="label">Disciplina</label><input name="discipline" required value="${esc(s.discipline||'')}"><div class="form-row"><div><label class="label">Início</label><input type="date" name="start" required value="${s.start}"></div><div><label class="label">Encerramento</label><input type="date" name="end" required value="${s.end}"></div></div><label class="label">Número de vagas</label><input name="slots" type="number" min="1" max="100" required value="${s.slots}"><label class="label">Descrição</label><textarea name="desc" required>${esc(s.desc||'')}</textarea><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">${sid?'Salvar alterações':'Criar processo'}</button></div></form>`)}
function flowCard(n,title,desc,role,p){return `<article class="card flow-card" tabindex="0" role="link" onclick="switchTo('${role}','${p}')" onkeydown="if(event.key==='Enter')switchTo('${role}','${p}')"><div class="card-head"><div class="flow-number">${n.padStart(2,'0')}</div>${tag(role)}</div><h2>${title}</h2><p>${desc}</p><span class="btn ghost">Demonstrar fluxo →</span></article>`}
function modal(title,html){$('#modal-title').textContent=title;$('#modal-body').innerHTML=html;document.querySelectorAll('#modal-body .label').forEach((label,i)=>{const field=label.nextElementSibling;if(field&&['INPUT','SELECT','TEXTAREA'].includes(field.tagName)){field.id='field-'+i;label.htmlFor=field.id}});if(!$('#modal').open)$('#modal').showModal()}
function closeModal(){$('#modal').close()}
function confirmAction(title,text,action,label='Confirmar'){window.pendingAction=action;modal(title,`<p>${esc(text)}</p><div class="form-actions">${btn('Voltar','closeModal()','secondary')}${btn(label,'runPending()','danger')}</div>`)}
function runPending(){const action=window.pendingAction;closeModal();window.pendingAction=null;action?.()}
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){let r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
function roomKeys() { return ['alg', 'calc', ...state.customRooms.map(r => r.key)]; }
function roomName(key) { return courseNames[key] || 'Sala indisponível'; }
function teacherName(key) { return key === 'calc' ? 'Rafael Lima' : 'Helena Martins'; }
function roomCode(key) { return key === 'alg' ? 'AJUDA26' : key === 'calc' ? 'CALC26' : state.customRooms.find(r => r.key === key)?.code; }
function roomOptions() { return state.role === 'Aluno' ? state.rooms.filter(k => roomKeys().includes(k)) : roomKeys(); }
function scoped(items) { return items.filter(x => (x.room || 'alg') === materialRoom); }
function selectRoom(key) { materialRoom = key; materialTopic = 'Todos'; materialQuery = ''; selectedId = null; activityLesson = null; render(); }
function roomSelect() {
  const keys = roomOptions();
  return `<select aria-label="Monitoria" onchange="selectRoom(this.value)">${keys.map(k => `<option value="${k}" ${k === materialRoom ? 'selected' : ''}>${esc(roomName(k))}</option>`).join('')}</select>`;
}
function enrollmentGate() {
  const keys = roomOptions();
  if (keys.length && !keys.includes(materialRoom)) materialRoom = keys[0];
  return state.role === 'Aluno' && !keys.length ? pageTop('Entre na sala para continuar.', 'Escolha uma monitoria para acessar seus materiais, agenda e atividades.', btn('Ir para minhas salas', "navigate('salas')")) : '';
}
function userField(form, name) { return String(form.elements.namedItem(name)?.value || '').trim(); }
function requireFields(form, fields) {
  for (const name of fields) if (!userField(form, name)) { toast('Preencha todos os campos sem usar apenas espaços.'); form.elements.namedItem(name)?.focus(); return false; }
  return true;
}
function commitMutation(mutator) {
  const previous = structuredClone(state);
  mutator();
  try { localStorage.setItem('ajudanois-v1', JSON.stringify(state)); return true; }
  catch { state = previous; toast('Não foi possível salvar. Reduza os arquivos ou libere espaço no navegador; a alteração não foi aplicada.'); return false; }
}
function finish(message) { closeModal(); render(); toast(message); }
function courseCard(key, student) {
  if (student && !state.rooms.includes(key)) return '';
  return `<div class="course"><div class="course-band"></div><div class="course-body"><div class="course-title"><div class="course-info"><span class="course-icon">${key === 'calc' ? 'ƒ' : '⌘'}</span><div><h3>${esc(roomName(key))}</h3><span class="muted">Prof(a). ${teacherName(key)} · 2026.2</span></div></div>${tag('Sala disponível', 'green')}</div><div class="course-footer"><span>Monitor Lucas Costa · ${state.role === 'Aluno' ? 'Você está inscrita' : 'Turma de demonstração'}</span>${btn('Acessar sala →', `openRoom('${key}')`, 'ghost')}</div></div></div>`;
}
function openRoom(key) { materialRoom = key; materialTopic = 'Todos'; materialQuery = ''; navigate('materiais'); }
function home() {
  const student = state.role === 'Aluno', coord = state.role === 'Coordenação';
  const keys = roomOptions(), visibleNotices = student ? state.notices.filter(n => state.rooms.includes(n.room || 'alg') && ['Toda a turma', 'Ana Souza'].includes(n.target)) : state.notices;
  const nextLessons = state.lessons.filter(l => l.status !== 'Concluída' && (!student || state.rooms.includes(l.room || 'alg'))).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
  const heading = coord ? 'Tudo em ordem, Marina.' : `Olá, ${names[state.role].split(' ')[0]} ☀`;
  const metrics = coord ? stat('Certificados ativos', state.certificates.filter(c => c.status === 'Disponível').length, 'Documentos disponíveis ao monitor', '◇') + stat('Horas registradas', totalHours() + 'h', 'Somadas dos registros de monitoria', '◷') + stat('Processos seletivos', state.selections.length, 'Processos cadastrados', '▣') + stat('Assinatura', state.signature ? 'Ativa' : 'Pendente', 'Para novas emissões', '✎') : stat(student ? 'Salas inscritas' : 'Salas disponíveis', keys.length, 'Monitorias acessíveis neste perfil', '▱') + stat(student ? 'Atividades enviadas' : 'Atividades da monitoria', state.activities.filter(a => (!student || state.rooms.includes(a.room || 'alg')) && (!student || a.response)).length, 'Dados atuais da demonstração', '✓') + stat('Próximas aulas', nextLessons.length, 'Encontros ainda não concluídos', '▦') + stat(student ? 'Presenças registradas' : 'Materiais publicados', student ? state.attendance.filter(a => a.present && state.rooms.includes(a.room || 'alg')).length : state.materials.length, 'Atualizado pelas suas interações', '▤');
  return pageTop(heading, 'Que bom ter você por aqui. Vamos aprender juntos?', '<span class="muted">Demonstração · 16 de outubro de 2026</span>') + `<div class="hero"><div class="eyebrow">Um semestre de possibilidades</div><h2>${coord ? 'Reconheça quem faz a diferença.' : 'Pequenas trocas. Grandes aprendizados.'}</h2><p>${coord ? 'Confira os registros, gerencie certificados e organize a seleção.' : 'Encontre sua sala, compartilhe conhecimento e acompanhe cada conquista.'}</p>${btn(coord ? 'Gerenciar certificados ↗' : student ? 'Explorar minhas salas ↗' : 'Acessar sala de materiais ↗', `navigate('${coord ? 'emissao' : student ? 'salas' : 'materiais'}')`)}${art()}</div><div class="stats">${metrics}</div>` + (coord ? `<div class="grid">${flowCard('16','Assinatura dos certificados','Cadastre e visualize a assinatura da coordenação.','Coordenação','assinatura')}${flowCard('22','Processos seletivos','Crie, atualize e exclua os processos.','Coordenação','selecao')}</div>` : `<div class="columns"><section><div class="section-heading"><h2>${student ? 'Minhas salas' : 'Suas monitorias'}</h2></div>${keys.map(k => courseCard(k,student)).join('') || empty('Você ainda não entrou em uma sala.')}</section><section><div class="section-heading"><h2>Na sua agenda</h2></div><div class="card">${nextLessons.slice(0,3).map(l => `<div class="event"><div class="date-tile">${new Date(l.date+'T12:00:00').toLocaleDateString('pt-BR',{month:'short'})}<strong>${l.date.slice(-2)}</strong></div><div><h3>${esc(l.title)}</h3><p>${fullDate(l.date)} · ${esc(l.time)} · ${esc(l.place)}</p>${tag(roomName(l.room || 'alg'))}</div></div>`).join('') || '<p class="muted">Nenhum encontro pendente.</p>'}</div><div class="section-heading"><h2>Último aviso</h2></div><div class="card">${visibleNotices.length ? `<h3>${esc(visibleNotices[0].title)}</h3><p class="muted">${esc(visibleNotices[0].body)}</p>${tag(visibleNotices[0].target)}` : '<p class="muted">Nenhum aviso para você.</p>'}</div></section></div>`);
}
function rooms() {
  return pageTop('Um espaço para aprender junto.', 'Entre em uma monitoria e encontre sua turma.', btn('＋ Entrar em uma sala', 'joinForm()'), 'Funcionalidade 08 · Aluno') + `<div class="banner">Convite recebido por e-mail (simulação) · Profa. Helena convidou você para Algoritmos e programação. ${btn('Ver convite','invite()','small secondary')}</div><div class="section-heading"><h2>Minhas salas (${state.rooms.length})</h2></div>${state.rooms.map(k => courseCard(k,true) + `<div style="text-align:right;margin:-5px 0 22px">${btn('Sair da sala',`leaveRoom('${k}')`,'ghost')}</div>`).join('') || empty('Você ainda não está inscrita. Entre com um código ou aceite o convite.')}<p class="muted">Códigos de exemplo: AJUDA26 (Algoritmos) e CALC26 (Cálculo). Salas criadas pelo Professor têm códigos próprios.</p>`;
}
function joinCode(form) {
  const code = userField(form, 'code').toUpperCase(), room = roomKeys().find(k => roomCode(k) === code);
  if (!room) return toast('Código não encontrado. Confira o código com o professor.');
  join(room);
}
function manualJoin() {
  modal('Encontrar uma monitoria', `<form onsubmit="event.preventDefault();join(this.elements.room.value)"><label class="label">Disciplina</label><select name="room">${roomKeys().map(k=>`<option value="${k}">${esc(roomName(k))} · ${teacherName(k)}</option>`).join('')}</select><div class="banner">Entrada manual habilitada para a demonstração.</div><div class="form-actions">${btn('Voltar','joinForm()','secondary')}<button class="btn">Entrar nesta sala</button></div></form>`);
}
function join(key) {
  if (!roomKeys().includes(key)) return toast('Esta sala não está mais disponível.');
  if (state.rooms.includes(key)) { closeModal(); toast('Você já está inscrita nesta sala.'); return; }
  if (commitMutation(()=>state.rooms.push(key))) finish('Inscrição confirmada. Sua sala está disponível.');
}
function leaveRoom(key) {
  confirmAction('Sair da sala?', `Você deixará de acessar ${roomName(key)}. Seu histórico será preservado para quando entrar novamente.`, () => {
    if (commitMutation(()=>state.rooms=state.rooms.filter(k=>k!==key))) { render(); toast('Você saiu da sala. Para retornar, use '+roomCode(key)+'.'); }
  }, 'Sair da sala');
}
function saveRoom(form) {
  if (state.role !== 'Professor' || !requireFields(form,['title','desc'])) return;
  const key='s'+id(); let code;
  do { code='AN'+String(id()).slice(-6); } while(roomKeys().some(k=>roomCode(k)===code));
  const room={key,title:userField(form,'title'),desc:userField(form,'desc'),code};
  if (commitMutation(()=>state.customRooms.push(room))) { courseNames[key]=room.title; materialRoom=key; materialTopic='Todos'; materialQuery=''; finish('Sala criada. Compartilhe o código '+code+' na demonstração.'); }
}
function materials() {
  const gate=enrollmentGate(); if(gate)return gate;
  const list=scoped(state.materials), custom=state.customRooms.find(r=>r.key===materialRoom);
  return pageTop('Conhecimento para compartilhar.',`Materiais de ${esc(roomName(materialRoom))} · 2026.2`,isStaff()?`<div class="actions" style="margin:0">${state.role==='Professor'?btn('＋ Criar sala','roomForm()','secondary'):''}${btn('＋ Publicar material','materialForm()')}</div>`:'','Funcionalidade 06 · Sala virtual')+`<div class="toolbar">${roomSelect()}<input class="search" aria-label="Buscar material" placeholder="⌕ Buscar nos materiais" value="${esc(materialQuery)}" oninput="filterMaterials(this.value)"><select aria-label="Filtrar unidade" onchange="materialTopic=this.value;renderMaterialList()"><option>Todos</option>${[...new Set(list.map(m=>m.topic))].map(t=>`<option ${t===materialTopic?'selected':''}>${esc(t)}</option>`).join('')}</select><span class="muted">${list.length} materiais na sala</span></div>${custom?`<div class="banner">${esc(custom.desc)}</div>`:''}${isStaff()?`<p class="muted">Código da sala: <strong>${roomCode(materialRoom)}</strong></p>`:''}<div class="grid" id="material-list">${materialCards()}</div>`;
}
async function saveMaterial(form,mid) {
  if(!isStaff()||!requireFields(form,['title','topic','desc']))return;
  const old=state.materials.find(m=>m.id===mid), file=form.elements.file.files[0];
  if(!old&&!file)return toast('Selecione um arquivo para publicar.');
  if(file&&file.size>1000000)return toast('Escolha um arquivo de até 1 MB.');
  const room=old?.room||materialRoom;
  const material={...old,id:mid||id(),room,title:userField(form,'title'),topic:userField(form,'topic'),desc:userField(form,'desc')};
  try { if(file){material.name=file.name;material.data=await readFile(file);material.mime=file.type;material.content=null;} }
  catch{return toast('Não foi possível ler o arquivo. Tente selecioná-lo novamente.');}
  if(commitMutation(()=>{if(mid)state.materials=state.materials.map(m=>m.id===mid?material:m);else state.materials.unshift(material);}))finish(mid?'Material atualizado.':'Material publicado na sala.');
}
function materialView(mid) {
  const m=state.materials.find(x=>x.id===mid);if(!m)return toast('Material não encontrado.');
  let preview='';
  if(m.content)preview=`<pre class="text-preview">${esc(m.content)}</pre>`;
  else if(/^data:image\/(png|jpeg|gif|webp);base64,/.test(m.data||''))preview=`<img class="material-preview" src="${esc(m.data)}" alt="${esc(m.title)}">`;
  else if(/^data:application\/pdf;base64,/.test(m.data||''))preview=`<object class="pdf-preview" data="${esc(m.data)}" type="application/pdf"><p>Visualização indisponível neste navegador. Baixe o PDF para abrir.</p></object>`;
  else if(/^data:text\/plain/.test(m.data||'')){try{const bytes=Uint8Array.from(atob(m.data.split(',')[1]),c=>c.charCodeAt(0));preview=`<pre class="text-preview">${esc(new TextDecoder().decode(bytes))}</pre>`;}catch{preview='';}}
  if(!preview)preview=`<div class="banner">Arquivo: ${esc(m.name)}. Baixe para abrir no aplicativo compatível.</div>`;
  modal(m.title,`<p class="muted">${esc(m.topic)} · ${esc(roomName(m.room||'alg'))}</p><p>${esc(m.desc)}</p>${preview}<div class="actions">${btn('↓ Baixar arquivo',`downloadMaterial(${mid})`)}${btn('Fechar','closeModal()','secondary')}</div>`);
}
function agenda() {
  const gate=enrollmentGate();if(gate)return gate;
  return pageTop('Toda boa troca tem seu momento.',`Agenda de ${esc(roomName(materialRoom))} · 2026.2`,state.role==='Monitor'?btn('＋ Agendar aula','lessonForm()'):'','Funcionalidade 12 · Aulas')+`<div class="toolbar">${roomSelect()}<span class="muted">Horários de Fortaleza · UTC−3</span></div>${scoped(state.lessons).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(l=>`<article class="card"><div class="card-head"><div><h2>${esc(l.title)}</h2><div class="detail-meta"><span>${fullDate(l.date)} · ${esc(l.time)}</span><span>${esc(l.place)}</span><span>${l.duration}h</span></div></div>${tag(l.status,l.status==='Em andamento'?'orange':'green')}</div><p class="muted">${esc(l.content)}</p><div class="actions">${btn('Ver detalhes',`lessonDetail(${l.id})`,'secondary')}${state.role==='Monitor'?`${btn('Editar aula',`lessonForm(${l.id})`,'ghost')}${l.status==='Agendada'?btn('Iniciar sessão simulada',`startLesson(${l.id})`):l.status==='Em andamento'?btn('Encerrar sessão',`endLesson(${l.id})`):''}${btn('Excluir',`deleteItem('lessons',${l.id},'aula')`,'ghost')}`:btn('Ver atividades desta aula',`lessonActivities(${l.id})`,'ghost')}</div></article>`).join('')||empty('Nenhuma aula nesta sala. O Monitor pode agendar o primeiro encontro.')}`;
}
function lessonDetail(lid) {
  const l=state.lessons.find(x=>x.id===lid);if(!l)return;
  const activities=state.activities.filter(a=>a.lessonId===lid);
  modal(l.title,`<div class="detail-meta">${fullDate(l.date)} · ${esc(l.time)} · ${l.duration}h</div><h3>Conteúdo do encontro</h3><p>${esc(l.content)}</p><p class="muted">Local: ${esc(l.place)}</p>${tag(l.status,l.status==='Em andamento'?'orange':'green')}<h3 style="margin-top:22px">Atividades vinculadas</h3>${activities.map(a=>`<p>${esc(a.title)}</p>`).join('')||'<p class="muted">Nenhuma atividade vinculada.</p>'}<div class="actions">${state.role==='Aluno'?btn('Ver atividades desta aula',`closeModal();lessonActivities(${lid})`):btn('Fechar','closeModal()','secondary')}</div>`);
}
function saveLesson(form,lid) {
  if(state.role!=='Monitor'||!requireFields(form,['title','date','time','place','content']))return;
  const duration=Number(userField(form,'duration'));if(duration<.5||duration>8)return toast('Informe uma duração entre 0,5 e 8 horas.');
  const old=state.lessons.find(l=>l.id===lid);
  const l={...old,id:lid||id(),room:old?.room||materialRoom,title:userField(form,'title'),date:userField(form,'date'),time:userField(form,'time'),duration,place:userField(form,'place'),content:userField(form,'content'),status:old?.status||'Agendada'};
  if(commitMutation(()=>{if(lid)state.lessons=state.lessons.map(x=>x.id===lid?l:x);else state.lessons.push(l);if(l.status==='Concluída'){const record=state.monitorRecords.find(r=>r.lessonId===lid);if(record){record.title=l.title;record.date=l.date;record.hours=l.duration;}}}))finish('Aula salva. A agenda do aluno foi atualizada.');
}
function startLesson(lid) {
  const l=state.lessons.find(x=>x.id===lid);if(!l||state.role!=='Monitor')return;
  if(state.lessons.some(x=>x.status==='Em andamento'&&(x.room||'alg')===(l.room||'alg')))return toast('Encerre a sessão atual desta sala antes de iniciar outra.');
  if(commitMutation(()=>l.status='Em andamento')){render();toast('Sessão simulada iniciada. Entregas vinculadas podem registrar presença.');}
}
function endLesson(lid) {
  const l=state.lessons.find(x=>x.id===lid);if(!l||l.status!=='Em andamento')return;
  confirmAction('Encerrar sessão?', 'O histórico manterá as presenças por interação e a duração da aula será somada aos registros de monitoria do exemplo.',()=>{
    if(commitMutation(()=>{l.status='Concluída';if(!state.attendance.some(p=>p.lessonId===lid))state.attendance.push({id:id(),lessonId:lid,room:l.room||'alg',title:l.title,date:l.date,present:false,evidence:'Sessão encerrada sem interação registrada'});if(!state.monitorRecords.some(r=>r.lessonId===lid))state.monitorRecords.push({id:id(),lessonId:lid,room:l.room||'alg',title:l.title,date:l.date,hours:l.duration});})) {render();toast('Sessão encerrada e carga horária registrada.');}
  },'Encerrar sessão');
}
function lessonActivities(lid) {const l=state.lessons.find(x=>x.id===lid);if(!l)return;materialRoom=l.room||'alg';activityLesson=lid;activityFilter='Todas';navigate('atividades');}
function activityStatus(a) {return a.grade!==null&&a.grade!==undefined&&a.grade!==''?'Corrigida':a.response?'Enviada':a.deadline<demoDate?'Prazo encerrado':'Pendente';}
function activities() {
  const gate=enrollmentGate();if(gate)return gate;
  const all=scoped(state.activities), lesson=state.lessons.find(l=>l.id===activityLesson);
  const list=all.filter(a=>(!lesson||a.lessonId===lesson.id)&&(activityFilter==='Todas'||activityFilter==='Pendentes'&&['Pendente','Prazo encerrado'].includes(activityStatus(a))||activityFilter==='Enviadas'&&activityStatus(a)==='Enviada'||activityFilter==='Corrigidas'&&activityStatus(a)==='Corrigida'));
  return pageTop('Aprender também é colocar em prática.',`Atividades de ${esc(roomName(materialRoom))}`,'','Funcionalidade 10 · Aluno')+`<div class="toolbar">${roomSelect()}${lesson?`${tag('Aula: '+lesson.title)}${btn('Mostrar todas',"activityLesson=null;render()",'ghost')}`:''}</div><div class="tabs">${['Todas','Pendentes','Enviadas','Corrigidas'].map(f=>`<button class="${f===activityFilter?'selected':''}" onclick="activityFilter='${f}';render()">${f}</button>`).join('')}</div><div class="grid">${list.map(a=>`<article class="card"><div class="card-head"><span class="file-icon">✓</span>${tag(activityStatus(a),a.response?'green':'orange')}</div><h2>${esc(a.title)}</h2><p class="muted">${esc(a.desc)}</p><div class="detail-meta"><span>Até ${fullDate(a.deadline)}</span><span>${esc(a.mode)}</span></div>${a.grade!==null&&a.grade!==undefined?`<p><strong>Nota ${esc(a.grade)}</strong> / 10</p>`:''}${a.lessonId?`<p class="muted">Aula: ${esc(state.lessons.find(l=>l.id===a.lessonId)?.title||'Aula removida do calendário')}</p>`:''}<div class="actions">${btn(a.response?'Consultar entrega':'Responder atividade',`activityView(${a.id})`)}${a.response&&a.deadline>=demoDate&&activityStatus(a)!=='Corrigida'?btn('Editar resposta',`activityView(${a.id},true)`,'secondary'):''}</div></article>`).join('')||empty('Nenhuma atividade neste filtro.')}</div><p class="muted">Data de referência para os prazos: 16/10/2026. As sessões de aula são simuladas para apresentação.</p>`;
}
function activityView(aid,edit=false) {
  const a=state.activities.find(x=>x.id===aid);if(!a)return toast('Atividade indisponível.');
  if(state.role==='Aluno'&&!state.rooms.includes(a.room||'alg'))return toast('Entre na sala para acessar esta atividade.');
  const corrected=activityStatus(a)==='Corrigida',locked=a.deadline<demoDate||corrected,l=state.lessons.find(x=>x.id===a.lessonId);
  modal(a.title,`<p>${esc(a.desc)}</p><div class="detail-meta">${esc(a.mode)} · Até ${fullDate(a.deadline)}</div>${corrected?`<div class="banner"><strong>Nota: ${esc(a.grade)} / 10</strong><p>${esc(a.feedback)}</p></div>`:''}${a.response&&!edit?`<label class="label">Sua resposta enviada</label><div class="card text-preview">${esc(a.response)}</div><p class="muted">${a.updated?'Última revisão: '+esc(a.updated):'Entrega registrada no exemplo.'}</p><div class="actions">${!locked?btn('Editar antes do prazo',`activityView(${aid},true)`):tag('Entrega encerrada')}${btn('Fechar','closeModal()','secondary')}</div>`:locked?'<div class="banner warn">Prazo encerrado ou resposta corrigida. A entrega está bloqueada.</div>':`<form onsubmit="event.preventDefault();submitResponse(this,${aid})"><label class="label">Sua resposta</label><textarea name="response" required minlength="5" placeholder="Escreva sua solução…">${esc(a.response)}</textarea>${a.mode==='Durante a aula'?`<div class="banner">${l?.status==='Em andamento'?'Sessão simulada em andamento: o envio também registra sua presença.':'A sessão desta aula não está aberta. Você pode entregar, mas a presença exige uma interação durante a sessão.'}</div>`:''}<div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">${a.response?'Salvar resposta':'Enviar resposta'}</button></div></form>`}`);
}
function submitResponse(form,aid) {
  const a=state.activities.find(x=>x.id===aid);if(state.role!=='Aluno'||!a||!state.rooms.includes(a.room||'alg'))return;
  if(a.deadline<demoDate||activityStatus(a)==='Corrigida')return toast('Esta entrega está encerrada.');
  const response=userField(form,'response');if(response.length<5)return toast('Escreva uma resposta com pelo menos 5 caracteres.');
  const lesson=state.lessons.find(l=>l.id===a.lessonId),presence=a.mode==='Durante a aula'&&lesson?.status==='Em andamento';
  let added=false;
  if(commitMutation(()=>{a.response=response;a.updated='16/10/2026 · revisão '+((a.revision||0)+1);a.revision=(a.revision||0)+1;if(presence&&!state.attendance.some(p=>p.lessonId===lesson.id&&p.present)){state.attendance.push({id:id(),lessonId:lesson.id,room:a.room||'alg',title:lesson.title,date:lesson.date,present:true,evidence:'Entrega: '+a.title+' · Sessão simulada'});added=true;}state.interacted=state.attendance.some(p=>p.lessonId===1&&p.present);}))finish(added?'Resposta enviada e presença registrada na aula.':'Resposta salva. O acompanhamento do monitor foi atualizado.');
}
function attendance() {
  const gate=enrollmentGate();if(gate)return gate;
  const entries=scoped(state.attendance),present=entries.filter(p=>p.present).length,live=scoped(state.lessons).filter(l=>l.status==='Em andamento');
  return pageTop('Cada participação conta.',`Sua frequência em ${esc(roomName(materialRoom))}`,'','Funcionalidade 09 · Aluno')+`<div class="toolbar">${roomSelect()}</div><div class="stats">${stat('Sua frequência',entries.length?Math.round(present/entries.length*100)+'%':'—','Aulas no histórico desta sala','◉')}${stat('Presenças',present,'Com evidência de interação','✓')}${stat('Sem registro',entries.length-present,'Histórico consultável','◷')}${stat('Sessões abertas',live.length,'Interaja para registrar presença','▦')}</div><div class="card"><h2>Interaja durante a aula</h2>${live.map(l=>`<p>${esc(l.title)} ${tag('Sessão simulada aberta','green')}</p>${btn('Responder atividade da aula',`lessonActivities(${l.id})`)}`).join('')||'<p class="muted">Nenhuma sessão aberta. No perfil Monitor, acesse Agenda e inicie uma sessão simulada.</p>'}</div><div class="banner">Hipótese de interface: o envio ou revisão de uma atividade vinculada à sessão aberta registra uma presença por aula. Uma entrega extraclasse ou fora da sessão não registra presença. Abrir a tela também não registra.</div><div class="table-wrap"><table><thead><tr><th>Aula</th><th>Data</th><th>Registro</th><th>Evidência</th></tr></thead><tbody>${entries.map(p=>`<tr><td>${esc(p.title)}</td><td>${fullDate(p.date)}</td><td>${tag(p.present?'Presente':'Sem registro',p.present?'green':'orange')}</td><td class="muted">${esc(p.evidence)}</td></tr>`).join('')||'<tr><td colspan="4">Nenhuma aula no histórico desta sala.</td></tr>'}</tbody></table></div>`;
}
function samplePeople() {return ['Ana Souza','Bruno Lima','Carla Mendes','Diego Santos'];}
function deliveryFor(a,name) {
  if(name==='Ana Souza')return {response:a.response||'',grade:a.grade,feedback:a.feedback||''};
  return state.deliveries.find(d=>d.activityId===a.id&&d.name===name)||{response:'',grade:null,feedback:''};
}
function deliveryStatus(d) {return d.grade!==null&&d.grade!==undefined&&d.grade!==''?'Corrigida':d.response?'Entregue':'Pendente';}
function tracking() {
  const all=scoped(state.activities);if(!all.some(a=>a.id===selectedId))selectedId=all[0]?.id||null;
  const activity=all.find(a=>a.id===selectedId),people=activity?samplePeople().map(name=>({name,...deliveryFor(activity,name)})):[];
  const filtered=people.filter(p=>(trackingFilter==='Todos'||deliveryStatus(p)===trackingFilter)&&p.name.toLowerCase().includes(trackingQuery.toLowerCase()));
  return pageTop('Um olhar atento para cada aluno.',`Entregas e pendências de ${esc(roomName(materialRoom))}`,btn('＋ Propor atividade','proposalForm()'),'Funcionalidade 13 · Monitor')+`<div class="toolbar">${roomSelect()}</div><div class="stats">${stat('Alunos da amostra',activity?people.length:0,'Turma fictícia deste protótipo','♧')}${stat('Entregas',people.filter(p=>p.response).length,'Atividade selecionada','✓')}${stat('Pendências',people.filter(p=>!p.response).length,'Atividade selecionada','◷')}${stat('Atividades',all.length,'Propostas nesta sala','▤')}</div><div class="toolbar"><select aria-label="Filtrar por atividade" onchange="trackingActivity(this.value)">${all.map(a=>`<option value="${a.id}" ${a.id===selectedId?'selected':''}>${esc(a.title)}</option>`).join('')||'<option>Nenhuma atividade</option>'}</select><select aria-label="Filtrar por situação" onchange="trackingFilter=this.value;render()">${['Todos','Entregue','Corrigida','Pendente'].map(f=>`<option ${f===trackingFilter?'selected':''}>${f}</option>`).join('')}</select><input class="search" aria-label="Buscar aluno" placeholder="Buscar aluno" value="${esc(trackingQuery)}" oninput="trackingQuery=this.value;updateTrackingRows()"></div>${activity?`<div class="card"><h3>${esc(activity.title)}</h3><p class="muted">${esc(activity.desc)}</p><span class="muted">Até ${fullDate(activity.deadline)} · ${esc(activity.mode)}</span></div>`:''}<div id="tracking-table">${trackingTable(filtered)}</div><div class="banner">A entrega de Ana Souza é a resposta enviada no perfil Aluno. Use os filtros para consultar entregas e identificar quem ainda precisa de apoio.</div>`;
}
function trackingTable(people) {
  const a=state.activities.find(x=>x.id===selectedId);if(!a)return empty('Nenhuma atividade nesta sala. Proponha uma para demonstrar o fluxo.');
  return `<div class="table-wrap"><table><thead><tr><th>Aluno</th><th>Atividade</th><th>Situação</th><th>Ação</th></tr></thead><tbody>${people.map(p=>`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(a.title)}</td><td>${tag(deliveryStatus(p),p.response?'green':'orange')}</td><td>${p.response?btn('Ver entrega',`viewDelivery('${p.name}')`,'ghost'):btn('Ver pendência',`pendingDelivery('${p.name}')`,'ghost')}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum aluno neste filtro.</td></tr>'}</tbody></table></div>`;
}
function trackingActivity(aid) {selectedId=Number(aid);render();}
function updateTrackingRows() {const a=state.activities.find(x=>x.id===selectedId);if(!a)return;const people=samplePeople().map(name=>({name,...deliveryFor(a,name)})).filter(p=>(trackingFilter==='Todos'||deliveryStatus(p)===trackingFilter)&&p.name.toLowerCase().includes(trackingQuery.toLowerCase()));$('#tracking-table').innerHTML=trackingTable(people);}
function viewDelivery(name) {
  const a=state.activities.find(x=>x.id===selectedId);if(!a)return;const d=deliveryFor(a,name);
  modal('Entrega · '+name,`<h3>${esc(a.title)}</h3><div class="card text-preview">${esc(d.response)}</div>${tag(deliveryStatus(d),'green')}${d.grade!==null&&d.grade!==undefined?`<div class="banner">Nota: ${esc(d.grade)} / 10<br>${esc(d.feedback)}</div>`:''}<div class="actions">${btn('Registrar correção',`correctionForm('${name}')`)}${btn('Fechar','closeModal()','secondary')}</div>`);
}
function pendingDelivery(name) {const a=state.activities.find(x=>x.id===selectedId);if(!a)return;modal('Pendência · '+name,`<p>Ainda não há resposta para ${esc(a.title)}.</p><p class="muted">Prazo: ${fullDate(a.deadline)}</p>${btn('Criar aviso individual',`closeModal();noticeForm(0,'${name}')`)}`);}
function proposalForm() {
  modal('Propor atividade à turma',`<form onsubmit="event.preventDefault();saveProposal(this)"><label class="label">Título</label><input name="title" required><label class="label">Enunciado</label><textarea name="desc" required></textarea><label class="label">Prazo</label><input type="date" name="deadline" value="2026-10-25" required min="2026-10-16"><label class="label">Forma de realização</label><select name="mode"><option>Extraclasse</option><option>Durante a aula</option></select><label class="label">Aula vinculada (para presença)</label><select name="lessonId"><option value="">Sem vínculo</option>${scoped(state.lessons).map(l=>`<option value="${l.id}">${esc(l.title)} · ${esc(l.status)}</option>`).join('')}</select><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Publicar atividade</button></div></form>`);
}
function saveProposal(form) {
  if(state.role!=='Monitor'||!requireFields(form,['title','desc','deadline']))return;
  const deadline=userField(form,'deadline'),mode=userField(form,'mode'),lessonId=Number(userField(form,'lessonId'))||null;
  if(deadline<demoDate)return toast('Use um prazo igual ou posterior a 16/10/2026.');
  if(mode==='Durante a aula'&&!lessonId)return toast('Vincule uma aula para demonstrar o registro de presença.');
  const a={id:id(),room:materialRoom,title:userField(form,'title'),desc:userField(form,'desc'),deadline,mode,lessonId,response:'',grade:null,feedback:''};
  if(commitMutation(()=>state.activities.push(a))){selectedId=a.id;trackingFilter='Todos';finish('Atividade publicada no perfil Aluno.');}
}
function correctionForm(name) {
  const a=state.activities.find(x=>x.id===selectedId);if(!a)return;const d=deliveryFor(a,name);
  modal('Correção · '+name,`<form onsubmit="event.preventDefault();saveCorrection(this,'${name}')"><h3>${esc(a.title)}</h3><div class="card text-preview">${esc(d.response)}</div><label class="label">Nota de 0 a 10</label><input name="grade" type="number" required min="0" max="10" step="0.1" value="${esc(d.grade===null||d.grade===undefined?'':String(d.grade).replace(',','.'))}"><label class="label">Feedback</label><textarea name="feedback" required>${esc(d.feedback)}</textarea><p class="muted">A correção ficará visível na entrega do aluno e encerrará a edição da resposta (hipótese do protótipo).</p><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Salvar correção</button></div></form>`);
}
function saveCorrection(form,name) {
  const a=state.activities.find(x=>x.id===selectedId);if(!a||state.role!=='Monitor'||!requireFields(form,['grade','feedback']))return;
  const grade=Number(userField(form,'grade'));if(!Number.isFinite(grade)||grade<0||grade>10)return toast('A nota deve estar entre 0 e 10.');
  if(commitMutation(()=>{const d=name==='Ana Souza'?a:state.deliveries.find(x=>x.activityId===a.id&&x.name===name);if(d){d.grade=String(grade).replace('.',',');d.feedback=userField(form,'feedback');}}))finish('Correção registrada. O aluno já pode consultar o resultado.');
}
function chat() {
  if(!roomKeys().includes(chatRoom))chatRoom='alg';
  const messages=state.messages.filter(m=>(m.room||'alg')===chatRoom);
  if(messages.some(m=>m.role!==state.role&&!m.readBy?.includes(state.role)))commitMutation(()=>messages.filter(m=>m.role!==state.role).forEach(m=>{m.readBy=[...new Set([...(m.readBy||[]),state.role])];}));
  return pageTop('Alinhe ideias. Compartilhe caminhos.','Canal de comunicação entre professor e monitor.','','Funcionalidade 03 · Conversas')+`<div class="chat"><aside class="chat-list"><h3>Monitorias</h3>${roomKeys().map(key=>`<button class="chat-contact" style="${key!==chatRoom?'background:transparent':''}" onclick="chatRoom='${key}';render()">${esc(roomName(key))}<small>Professor(a) e Lucas · Histórico</small></button>`).join('')}</aside><section class="chat-main"><div class="chat-header"><h3>${esc(roomName(chatRoom))}</h3><span class="muted">Prof(a). ${teacherName(chatRoom)} · Monitor Lucas Costa</span><select aria-label="Selecionar conversa" onchange="chatRoom=this.value;render()">${roomKeys().map(k=>`<option value="${k}" ${k===chatRoom?'selected':''}>${esc(roomName(k))}</option>`).join('')}</select></div><div class="chat-messages">${messages.map(m=>`<div class="message ${m.role===state.role?'own':''}"><small>${esc(m.name)} · ${esc(m.time)}${m.edited?' · editada':''}</small><p class="text-preview">${esc(m.text)}</p><small>${m.role===state.role?(m.readBy?.some(r=>r!==m.role)?'✓✓ Lida pelo outro perfil':'✓ Enviada · aguardando leitura'):'Mensagem recebida'}</small>${m.role===state.role?`<div><button type="button" onclick="messageForm(${m.id})">Editar</button><button type="button" onclick="deleteItem('messages',${m.id},'mensagem')">Excluir</button></div>`:''}</div>`).join('')||'<p class="muted">Esta monitoria ainda não tem mensagens. Inicie a conversa.</p>'}</div><form class="chat-compose" onsubmit="event.preventDefault();sendMessage(this)"><input name="message" aria-label="Mensagem" required maxlength="2000" placeholder="Escreva sua mensagem…"><button class="btn">Enviar ↑</button></form></section></div><p class="muted">A mensagem passa de enviada para lida ao abrir esta conversa no outro perfil. A troca acontece apenas neste navegador.</p>`;
}
function sendMessage(form) {
  if(!isStaff())return;const text=userField(form,'message');if(!text)return toast('Escreva uma mensagem antes de enviar.');
  if(commitMutation(()=>state.messages.push({id:id(),role:state.role,name:state.role==='Professor'?'Prof(a). '+teacherName(chatRoom):names[state.role],text,time:'16/10 · '+new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Fortaleza'}),room:chatRoom,readBy:[state.role]}))){render();$('.chat-messages').scrollTop=100000;}
}
function messageForm(mid) {
  const m=state.messages.find(x=>x.id===mid);if(!m||m.role!==state.role)return toast('Apenas o autor pode editar esta mensagem.');
  modal('Editar mensagem',`<form onsubmit="event.preventDefault();updateMessage(this,${mid})"><label class="label">Mensagem</label><textarea name="text" required maxlength="2000">${esc(m.text)}</textarea><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Salvar mensagem</button></div></form>`);
}
function updateMessage(form,mid) {
  const m=state.messages.find(x=>x.id===mid);if(!m||m.role!==state.role||!requireFields(form,['text']))return;
  if(commitMutation(()=>{m.text=userField(form,'text');m.edited=true;m.readBy=[state.role];}))finish('Mensagem atualizada. Aguardando nova leitura.');
}
function notices() {
  const gate=enrollmentGate();if(gate)return gate;
  const list=scoped(state.notices).filter(n=>state.role!=='Aluno'||['Toda a turma','Ana Souza'].includes(n.target)).filter(n=>noticeFilter==='Todos'||noticeFilter==='Não lidos'&&!n.read||noticeFilter==='Lidos'&&n.read);
  return pageTop('Informação que chega a quem precisa.',`Avisos de ${esc(roomName(materialRoom))}`,state.role==='Monitor'?btn('＋ Criar aviso','noticeForm()'):'','Funcionalidade 15 · Avisos')+`<div class="toolbar">${roomSelect()}${state.role==='Aluno'?`<select aria-label="Filtrar leitura de avisos" onchange="noticeFilter=this.value;render()">${['Todos','Não lidos','Lidos'].map(f=>`<option ${f===noticeFilter?'selected':''}>${f}</option>`).join('')}</select>`:''}</div>`+(list.map(n=>`<article class="card"><div class="card-head"><div><h2>${esc(n.title)}</h2><span class="muted">Lucas Costa · ${esc(n.date)}</span></div>${tag(n.target,n.target==='Toda a turma'?'green':'orange')}</div><p class="text-preview">${esc(n.body)}</p>${state.role==='Aluno'?tag(n.read?'Lido':'Novo',n.read?'':'green'):''}<div class="actions">${btn('Visualizar',`noticeView(${n.id})`,'secondary')}${state.role==='Monitor'?btn('Editar',`noticeForm(${n.id})`,'ghost')+btn('Excluir',`deleteItem('notices',${n.id},'aviso')`,'ghost'):''}</div></article>`).join('')||empty('Nenhum aviso neste filtro.'));
}
function noticeView(nid) {
  const n=state.notices.find(x=>x.id===nid);if(!n)return;
  if(state.role==='Aluno'&&(!state.rooms.includes(n.room||'alg')||!['Toda a turma','Ana Souza'].includes(n.target)))return toast('Este aviso não é destinado a você.');
  if(state.role==='Aluno'&&!n.read){commitMutation(()=>n.read=true);render();}
  modal(n.title,`<p class="muted">Para: ${esc(n.target)} · ${esc(n.date)}</p><p class="text-preview">${esc(n.body)}</p><p class="muted">Publicado por Lucas Costa · ${esc(roomName(n.room||'alg'))}</p>${btn('Fechar','closeModal()','secondary')}`);
}
function saveNotice(form,nid) {
  if(state.role!=='Monitor'||!requireFields(form,['title','body']))return;
  const old=state.notices.find(n=>n.id===nid),n={...old,id:nid||id(),room:old?.room||materialRoom,target:userField(form,'target'),title:userField(form,'title'),body:userField(form,'body'),date:'16 out. 2026',read:false};
  if(commitMutation(()=>{if(nid)state.notices=state.notices.map(x=>x.id===nid?n:x);else state.notices.unshift(n);}))finish('Aviso disponível para '+n.target.toLowerCase()+'.');
}
function signatureForm() {
  const s=state.signature||{};
  modal(s.name?'Editar assinatura':'Cadastrar assinatura',`<form onsubmit="event.preventDefault();saveSignature(this)"><label class="label">Nome da coordenação</label><input name="signer" required value="${esc(s.name||'')}"><label class="label">Cargo</label><input name="position" required value="${esc(s.position||'')}"><label class="label">Imagem da assinatura (opcional)</label><input type="file" name="file" accept="image/png,image/jpeg" onchange="previewSignature(this)"><div id="signature-preview">${s.image?`<img class="signature" src="${s.image}" alt="Imagem atual da assinatura">`:''}</div>${s.image?'<label class="checkbox"><input type="checkbox" name="removeImage"> Remover imagem atual e usar somente o nome</label>':''}<p class="muted">PNG ou JPG até 500 KB. Use uma assinatura fictícia.</p><div class="form-actions">${btn('Cancelar','closeModal()','secondary')}<button class="btn">Salvar assinatura</button></div></form>`);
}
async function previewSignature(input) {
  const file=input.files[0];if(!file)return;
  if(!['image/png','image/jpeg'].includes(file.type)||file.size>500000){input.value='';toast('Use PNG ou JPG de até 500 KB.');return;}
  try {const data=await readFile(file);$('#signature-preview').innerHTML=`<img class="signature" src="${data}" alt="Prévia da nova assinatura">`;}
  catch {toast('Não foi possível ler a imagem selecionada.');}
}
async function saveSignature(form) {
  if(state.role!=='Coordenação'||!requireFields(form,['signer','position']))return;
  let image=form.elements.removeImage?.checked?'':state.signature?.image||'';
  const file=form.elements.file.files[0];
  if(file){if(!['image/png','image/jpeg'].includes(file.type)||file.size>500000)return toast('Use PNG ou JPG de até 500 KB.');try{image=await readFile(file);await imageFromData(image);}catch{return toast('A imagem não pôde ser aberta. Escolha outro PNG ou JPG.');}}
  const signature={name:userField(form,'signer'),position:userField(form,'position'),image};
  if(commitMutation(()=>state.signature=signature))finish('Assinatura salva. Certificados anteriores preservam a versão usada na emissão.');
}
function deleteSignature() {
  confirmAction('Excluir assinatura?','Novas emissões e reemissões ficarão bloqueadas até você cadastrar outra assinatura. Os certificados anteriores serão preservados.',()=>{if(commitMutation(()=>state.signature=null)){render();toast('Assinatura excluída.');}});
}
function recordsFor(room=materialRoom) {return state.monitorRecords.filter(r=>(r.room||'alg')===room);}
function totalHours(room=null) {return (room?recordsFor(room):state.monitorRecords).reduce((sum,r)=>sum+Number(r.hours),0);}
function monitorHistory(room=materialRoom) {
  const records=recordsFor(room);
  modal('Histórico da monitoria',`<h3>${esc(roomName(room))} · 2026.2</h3><p class="muted">Monitor: Lucas Costa · Professor(a): ${teacherName(room)}</p><div class="table-wrap"><table><thead><tr><th>Registro</th><th>Data</th><th>Horas</th></tr></thead><tbody>${records.map(r=>`<tr><td>${esc(r.title)}</td><td>${fullDate(r.date)}</td><td>${r.hours}h</td></tr>`).join('')||'<tr><td colspan="3">Ainda não há registros nesta monitoria.</td></tr>'}</tbody></table></div><p><strong>Total: ${totalHours(room)} horas</strong></p><div class="banner">Registros de exemplo. Encerrar uma sessão simulada no perfil Monitor adiciona a duração da aula, uma única vez. Uma emissão guarda uma cópia da carga horária naquele momento.</div>${btn('Fechar','closeModal()','secondary')}`);
}
function certificates() {
  const pendingRooms=[...new Set(state.monitorRecords.map(r=>r.room||'alg'))].filter(room=>!state.certificates.some(c=>(c.room||'alg')===room&&c.term==='2026.2'&&c.status==='Disponível'));
  return pageTop('Seu esforço merece reconhecimento.','Consulte situação, documentos e histórico das suas monitorias.','','Funcionalidade 14 · Monitor')+`<div class="toolbar"><select aria-label="Filtrar certificados" onchange="certificateFilter=this.value;render()">${['Todos','Disponível','Cancelado'].map(f=>`<option ${f===certificateFilter?'selected':''}>${f}</option>`).join('')}</select></div><div class="grid">${state.certificates.filter(c=>certificateFilter==='Todos'||c.status===certificateFilter).map(c=>`<article class="card"><div class="card-head"><span class="file-icon">◇</span>${tag(c.status,c.status==='Disponível'?'green':'red')}</div><h2>${esc(c.course)}</h2><p class="muted">Semestre ${esc(c.term)} · ${esc(c.professor||teacherName(c.room||'alg'))}</p><div class="detail-meta"><span>${c.hours} horas</span><span>${fullDate(c.date)}</span></div><p class="muted">Registro ${esc(c.code)}</p><div class="actions">${btn('Visualizar',`certificateView(${c.id})`,'secondary')}${c.status==='Disponível'?btn('↓ Baixar PDF',`downloadCertificate(${c.id})`):tag('Download indisponível','red')}${c.term==='2026.2'?btn('Ver histórico',`monitorHistory('${c.room||'alg'}')`,'ghost'):btn('Ver origem',`certificateOrigin(${c.id})`,'ghost')}</div></article>`).join('')||empty('Nenhum certificado neste filtro.')}${certificateFilter==='Todos'?pendingRooms.map(room=>`<article class="card"><div class="card-head"><span class="file-icon">◷</span>${tag('Aguardando emissão','orange')}</div><h2>${esc(roomName(room))}</h2><p class="muted">Semestre 2026.2 · ${totalHours(room)}h registradas</p><p class="muted">O documento aparecerá aqui após a emissão pela Coordenação.</p>${btn('Ver histórico da monitoria',`monitorHistory('${room}')`,'secondary')}</article>`).join(''):''}</div>`;
}
function certificateOrigin(cid) {const c=state.certificates.find(x=>x.id===cid);if(!c)return;modal('Origem do certificado',`<h3>${esc(c.course)} · ${esc(c.term)}</h3><p>Monitor: Lucas Costa<br>Carga horária consolidada no registro histórico: ${c.hours}h<br>Professor(a): ${esc(c.professor||'Helena Martins')}</p><p class="muted">Monitoria de semestre anterior, mantida como exemplo de histórico.</p>`);}
function issuance() {
  const hours=totalHours(materialRoom);
  return pageTop('Reconhecimento pronto para ser entregue.','Emita certificados com os registros da monitoria.',btn('＋ Emitir certificado','issueForm()'),'Funcionalidade 17 · Coordenação')+`<div class="toolbar">${roomSelect()}</div>${!state.signature?'<div class="banner warn">Cadastre uma assinatura antes de emitir ou reemitir certificados.</div>':''}<div class="card"><div class="card-head"><div><h2>${esc(roomName(materialRoom))} · 2026.2</h2><p class="muted">Monitor Lucas Costa · Prof(a). ${teacherName(materialRoom)}</p></div>${tag(hours+'h registradas',hours?'green':'orange')}</div><p class="muted">Carga horária calculada a partir dos registros da monitoria. A assinatura e a data são preenchidas na confirmação.</p>${btn('Conferir registros',`monitorHistory('${materialRoom}')`,'secondary')}</div><div class="table-wrap"><table><thead><tr><th>Monitor / disciplina</th><th>Semestre</th><th>Carga horária</th><th>Situação</th><th>Ações</th></tr></thead><tbody>${state.certificates.filter(c=>(c.room||'alg')===materialRoom).map(c=>`<tr><td><strong>Lucas Costa</strong><br><span class="muted">${esc(c.course)} · ${esc(c.code)}</span></td><td>${esc(c.term)}</td><td>${c.hours}h</td><td>${tag(c.status,c.status==='Disponível'?'green':'red')}</td><td><div class="actions" style="margin:0">${btn('Consultar',`certificateView(${c.id})`,'ghost')}${btn('Reemitir',`reissue(${c.id})`,'ghost')}${c.status==='Disponível'?btn('Cancelar',`cancelCertificate(${c.id})`,'ghost'):''}</div></td></tr>`).join('')||'<tr><td colspan="5">Nenhum certificado emitido nesta sala.</td></tr>'}</tbody></table></div><div class="banner">Os registros e a data de referência são demonstrativos. O certificado contém a indicação de que não possui validade oficial.</div>`;
}
function issueForm() {
  if(!state.signature)return modal('Assinatura necessária',`<p>Cadastre a assinatura antes de emitir.</p>${btn('Cadastrar assinatura',"closeModal();navigate('assinatura');signatureForm()")}`);
  if(totalHours(materialRoom)<=0)return modal('Sem carga horária registrada',`<p>Esta monitoria ainda não tem registros. Encerre uma sessão no perfil Monitor e consulte novamente.</p>${btn('Fechar','closeModal()')}`);
  const active=state.certificates.find(c=>(c.room||'alg')===materialRoom&&c.term==='2026.2'&&c.status==='Disponível');
  if(active)return modal('Certificado já disponível',`<p>Esta monitoria já tem um certificado ativo. A reemissão gera uma nova versão e cancela a anterior.</p>${btn('Reemitir certificado',`reissue(${active.id})`)} ${btn('Voltar','closeModal()','secondary')}`);
  modal('Conferir e emitir certificado',`<div class="banner">Dados obtidos dos registros da monitoria selecionada.</div><p><strong>Monitor:</strong> Lucas Costa<br><strong>Disciplina:</strong> ${esc(roomName(materialRoom))}<br><strong>Semestre:</strong> 2026.2<br><strong>Carga horária:</strong> ${totalHours(materialRoom)} horas<br><strong>Data de emissão:</strong> 16/10/2026<br><strong>Assinatura:</strong> ${esc(state.signature.name)}</p><div class="form-actions">${btn('Voltar','closeModal()','secondary')}${btn('Confirmar emissão','issueCertificate()')}</div>`);
}
function certificateSnapshot(base={}) {
  const room=base.room||materialRoom;
  return {...base,id:id(),room,term:base.term||'2026.2',course:base.course||roomName(room),hours:base.term&&base.term!=='2026.2'?base.hours:totalHours(room),date:demoDate,status:'Disponível',code:'AN-2026-'+String(state.certificates.length+1).padStart(3,'0')+'-'+String(id()).slice(-4),signer:state.signature.name,position:state.signature.position,image:state.signature.image,professor:teacherName(room),events:[{action:base.id?'Reemissão':'Emissão',date:'16/10/2026',detail:base.id?'Substitui '+base.code:'Documento disponibilizado ao monitor'}]};
}
function issueCertificate() {
  if(state.role!=='Coordenação'||!state.signature||totalHours(materialRoom)<=0)return toast('Confira a assinatura e os registros.');
  if(state.certificates.some(c=>(c.room||'alg')===materialRoom&&c.term==='2026.2'&&c.status==='Disponível'))return toast('Já existe um certificado ativo. Use a reemissão.');
  const c=certificateSnapshot();if(commitMutation(()=>state.certificates.push(c)))finish('Certificado disponível no perfil Monitor.');
}
function reissue(cid) {
  const old=state.certificates.find(c=>c.id===cid);if(!old)return;
  if(!state.signature)return toast('Cadastre uma assinatura antes de reemitir.');
  if(old.term==='2026.2'&&totalHours(old.room||'alg')<=0)return toast('Não há carga horária atual para reemitir esta monitoria.');
  confirmAction('Reemitir certificado?','A nova versão usará a assinatura atual e os registros disponíveis. As versões ativas desta mesma monitoria e semestre serão canceladas.',()=>{
    if(!state.signature)return toast('Assinatura indisponível.');const c=certificateSnapshot(old);
    if(commitMutation(()=>{state.certificates.filter(x=>(x.room||'alg')===(old.room||'alg')&&x.term===old.term&&x.status==='Disponível').forEach(x=>{x.status='Cancelado';x.events=x.events||[];x.events.push({action:'Substituição',date:'16/10/2026',detail:'Substituído por '+c.code});});state.certificates.push(c);})){render();toast('Certificado reemitido. O histórico preserva a versão anterior.');}
  },'Confirmar reemissão');
}
function cancelCertificate(cid) {
  const c=state.certificates.find(x=>x.id===cid);if(!c||c.status!=='Disponível')return;
  confirmAction('Cancelar certificado?','O histórico será preservado, e o download desta versão ficará bloqueado.',()=>{if(commitMutation(()=>{c.status='Cancelado';c.events=c.events||[];c.events.push({action:'Cancelamento',date:'16/10/2026',detail:'Cancelado pela coordenação no protótipo'});})){render();toast('Certificado cancelado.');}},'Cancelar certificado');
}
function certificateView(cid) {
  const c=state.certificates.find(x=>x.id===cid);if(!c)return;
  modal('Visualização do certificado',`${c.status==='Cancelado'?'<div class="banner warn">Certificado cancelado. Consulte o histórico abaixo.</div>':''}${certificateHTML(c)}<div class="actions">${c.status==='Disponível'?btn('↓ Baixar PDF',`downloadCertificate(${cid})`):''}${btn('Fechar','closeModal()','secondary')}</div><h3 style="margin-top:22px">Histórico do documento</h3>${(c.events||[{action:'Emissão',date:fullDate(c.date),detail:'Documento histórico da demonstração'}]).map(e=>`<p class="muted"><strong>${esc(e.action)}</strong> · ${esc(e.date)}<br>${esc(e.detail)}</p>`).join('')}`);
}
function imageFromData(data) {return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=data;});}
function pdfFromJpeg(jpeg,width=842,height=595) {
  const encoder=new TextEncoder(),parts=[],offsets=[0];let size=0;
  const add=data=>{const bytes=typeof data==='string'?encoder.encode(data):data;parts.push(bytes);size+=bytes.length;};
  const object=(number,body)=>{offsets[number]=size;add(number+' 0 obj\n'+body+'\nendobj\n');};
  add('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');object(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
  const commands=`q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
  object(4,`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);
  offsets[5]=size;add(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width 1684 /Height 1190 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);add(jpeg);add('\nendstream\nendobj\n');
  const xref=size;add('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)add(String(offsets[i]).padStart(10,'0')+' 00000 n \n');add(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts,{type:'application/pdf'});
}
async function downloadCertificate(cid) {
  const c=state.certificates.find(x=>x.id===cid);if(!c||c.status!=='Disponível')return toast('Certificado cancelado: download indisponível.');
  try {
    const canvas=document.createElement('canvas');canvas.width=1684;canvas.height=1190;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fffef7';ctx.fillRect(0,0,1684,1190);ctx.strokeStyle='#8baa8e';ctx.lineWidth=5;ctx.strokeRect(55,55,1574,1080);ctx.lineWidth=1;ctx.strokeRect(70,70,1544,1050);ctx.textAlign='center';ctx.fillStyle='#295540';
    const text=(value,y,font='28px Georgia')=>{ctx.font=font;ctx.fillText(value,842,y,1450);};
    text('AJUDANOIS · PROGRAMA DE MONITORIAS',170,'22px Arial');text('Certificado de monitoria',285,'bold 64px Georgia');text('Certificamos, para fins de demonstração, que',380);text('Lucas Costa',470,'bold 54px Georgia');text('participou da monitoria de',550);text(c.course,605,'bold 34px Georgia');text(`no semestre ${c.term}, com carga horária de ${c.hours} horas.`,665);text('Emitido em '+fullDate(c.date),735,'25px Georgia');
    if(c.image){const image=await imageFromData(c.image),scale=Math.min(330/image.width,110/image.height);ctx.drawImage(image,842-image.width*scale/2,770,image.width*scale,image.height*scale);}else text(c.signer,845,'italic 44px Georgia');
    text(c.signer,915,'24px Georgia');text(c.position,950,'22px Georgia');text(c.code+' · '+c.status,1010,'20px Arial');text('MODELO DEMONSTRATIVO · SEM VALIDADE OFICIAL',1060,'18px Arial');
    const encoded=canvas.toDataURL('image/jpeg',.94).split(',')[1],bytes=Uint8Array.from(atob(encoded),ch=>ch.charCodeAt(0));
    download('certificado-'+c.code+'.pdf',pdfFromJpeg(bytes));toast('Certificado demonstrativo baixado em PDF.');
  } catch {toast('Não foi possível gerar o PDF. Verifique a imagem da assinatura e tente novamente.');}
}
function selectionStatus(s) {return s.end<demoDate?'Encerrado':s.start>demoDate?'Agendado':'Em período de seleção';}
function selections() {
  const list=state.selections.filter(s=>(s.title+' '+s.discipline).toLowerCase().includes(selectionQuery.toLowerCase())&&(selectionFilter==='Todos'||selectionStatus(s)===selectionFilter));
  return pageTop('Novas oportunidades para compartilhar.','Organize os processos seletivos de monitoria.',btn('＋ Criar processo','selectionForm()'),'Funcionalidade 22 · Coordenação')+`<div class="toolbar"><input class="search" aria-label="Buscar processo" value="${esc(selectionQuery)}" placeholder="Buscar processo ou disciplina" oninput="selectionQuery=this.value;updateSelectionList()"><select aria-label="Filtrar processos" onchange="selectionFilter=this.value;render()">${['Todos','Agendado','Em período de seleção','Encerrado'].map(f=>`<option ${f===selectionFilter?'selected':''}>${f}</option>`).join('')}</select></div><div class="grid" id="selection-list">${selectionCards(list)}</div><div class="banner">Funcionalidade 22 conforme sua descrição: criar, atualizar e excluir processos. Perfil, campos, vagas, datas e situação calculada são hipóteses de interface. Data de referência: 16/10/2026.</div>`;
}
function selectionCards(list) {return list.map(s=>`<article class="card"><div class="card-head"><span class="file-icon">▣</span>${tag(selectionStatus(s),s.end<demoDate?'':'green')}</div><h2>${esc(s.title)}</h2><p class="muted">${esc(s.discipline)} · ${s.slots} vagas</p><div class="detail-meta">${fullDate(s.start)} a ${fullDate(s.end)}</div><p class="text-preview">${esc(s.desc)}</p><div class="actions">${btn('Ver detalhes',`selectionView(${s.id})`,'secondary')}${btn('Atualizar',`selectionForm(${s.id})`,'ghost')}${btn('Excluir',`deleteItem('selections',${s.id},'processo seletivo')`,'ghost')}</div></article>`).join('')||empty('Nenhum processo neste filtro.');}
function updateSelectionList() {$('#selection-list').innerHTML=selectionCards(state.selections.filter(s=>(s.title+' '+s.discipline).toLowerCase().includes(selectionQuery.toLowerCase())&&(selectionFilter==='Todos'||selectionStatus(s)===selectionFilter)));}
function saveSelection(form,sid) {
  if(state.role!=='Coordenação'||!requireFields(form,['title','discipline','start','end','slots','desc']))return;
  const start=userField(form,'start'),end=userField(form,'end'),slots=Number(userField(form,'slots'));if(end<start)return toast('O encerramento deve ser igual ou posterior ao início.');if(!Number.isInteger(slots)||slots<1||slots>100)return toast('Informe de 1 a 100 vagas inteiras.');
  const s={id:sid||id(),title:userField(form,'title'),discipline:userField(form,'discipline'),start,end,slots,desc:userField(form,'desc')};
  if(commitMutation(()=>{if(sid)state.selections=state.selections.map(x=>x.id===sid?s:x);else state.selections.unshift(s);}))finish('Processo seletivo salvo.');
}
function deleteItem(collection,itemId,label) {
  const item=state[collection]?.find(x=>x.id===itemId);if(!item)return toast('Registro indisponível.');
  if(collection==='messages'&&item.role!==state.role)return toast('Apenas o autor pode excluir esta mensagem.');
  if(collection==='lessons'&&item.status==='Em andamento')return toast('Encerre a sessão antes de excluir a aula.');
  if(collection==='lessons'&&state.activities.some(a=>a.lessonId===itemId))return modal('Aula vinculada a atividades',`<p>Esta aula tem atividades vinculadas. O vínculo preserva o histórico de entregas e presença; por isso, a exclusão está bloqueada neste protótipo.</p>${btn('Fechar','closeModal()')}`);
  confirmAction('Excluir '+label+'?',`O registro será removido da demonstração. ${collection==='lessons'?'Presenças e carga horária já consolidadas permanecerão no histórico.':''}`,()=>{if(commitMutation(()=>state[collection]=state[collection].filter(x=>x.id!==itemId))){render();toast('Exclusão concluída.');}},'Excluir');
}
function resetDemo() {
  confirmAction('Restaurar dados de exemplo?','Todas as alterações locais serão substituídas pelos dados iniciais. Os 12 fluxos continuarão disponíveis.',()=>{
    const role=state.role;if(commitMutation(()=>{state=structuredClone(seed);state.role=role;})){materialRoom='alg';chatRoom='alg';materialQuery='';materialTopic='Todos';selectedId=null;activityLesson=null;trackingQuery='';selectionQuery='';selectionFilter='Todos';noticeFilter='Todos';certificateFilter='Todos';activityFilter='Todas';trackingFilter='Todos';for(const key of Object.keys(courseNames))if(!['alg','calc'].includes(key))delete courseNames[key];render();toast('Dados restaurados.');}
  },'Restaurar dados');
}
function guide() {
  const flows=[['3','Conversa de monitoria','Envie como Monitor. Abra a conversa como Professor para registrar a leitura. Edite e exclua apenas mensagens próprias.','Monitor','conversas'],['6','Materiais da disciplina','Como Professor, crie uma sala e publique um arquivo. Edite a unidade, consulte a prévia e baixe como Aluno inscrito.','Professor','materiais'],['8','Entrada na sala','Saia e entre com AJUDA26 ou CALC26, pela entrada manual ou pelo convite simulado. O histórico é preservado.','Aluno','salas'],['9','Presença por interação','No perfil Monitor, inicie uma sessão na Agenda. Como Aluno, responda uma atividade vinculada e consulte a presença.','Aluno','presenca'],['10','Resposta às atividades','Envie e revise antes do prazo. Consulte a correção feita pelo Monitor. A entrega extraclasse não registra presença.','Aluno','atividades'],['12','Aulas da monitoria','Agende, consulte, edite e exclua aulas sem vínculos. Inicie e encerre sessões para demonstrar o fluxo de participação.','Monitor','agenda'],['13','Entregas e pendências','Selecione a atividade, combine situação e busca por aluno. Consulte entregas, registre correção e proponha nova atividade de demonstração.','Monitor','acompanhamento'],['14','Certificados do monitor','Consulte situação e origem, visualize e baixe PDF. Versões canceladas permanecem no histórico.','Monitor','certificados'],['15','Avisos para alunos','Publique para a turma ou um aluno. Consulte, edite e exclua. O Aluno recebe somente seus avisos e registra a leitura.','Monitor','avisos'],['16','Assinatura','Cadastre nome e cargo; anexe, substitua ou remova uma imagem. Visualize e exclua. Emissões anteriores preservam a assinatura.','Coordenação','assinatura'],['17','Emissão de certificados','Confira a soma dos registros. Emita, consulte, reemita e cancele. A nova versão aparece no perfil Monitor.','Coordenação','emissao'],['22','Processo seletivo','Crie, consulte, atualize e exclua. Busque por título/disciplina e filtre a situação calculada pelas datas.','Coordenação','selecao']];
  return pageTop('Explore cada caminho.','Roteiro das 12 funcionalidades solicitadas.',btn('Restaurar dados de exemplo','resetDemo()','secondary'),'Guia de demonstração')+`<div class="banner">Protótipo local com dados fictícios. Alterne os perfis para apresentar as etapas. Não há backend, autenticação ou envio externo. As mudanças persistem somente neste navegador.</div><div class="grid">${flows.map(f=>flowCard(...f)).join('')}</div><div class="card" style="margin-top:22px"><h2>Hipóteses da demonstração</h2><p class="muted">Escopo: 3, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17 e 22. A 22 segue sua descrição na conversa. As regras do PDF não estavam preenchidas.</p><p class="muted">Data fixa: 16/10/2026. Sessões abertas simulam uma aula em andamento, independentemente da data. Uma interação vinculada registra uma presença por aula. Encerrar uma sessão soma sua duração à carga horária; os registros iniciais são fictícios. Reemissão cancela versões ativas da mesma monitoria/semestre. Certificados PDF não têm validade oficial. Propor e corrigir atividades são ações de apoio aos fluxos 10 e 13.</p></div>`;
}

// Migrate the existing local prototype without discarding user edits.
const flowDefaults={
  monitorRecords:[{id:101,room:'alg',title:'Planejamento e preparação de materiais',date:'2026-09-04',hours:10},{id:102,room:'alg',title:'Atendimento e orientação aos alunos',date:'2026-09-18',hours:10},{id:103,room:'alg',title:'Encontros de revisão',date:'2026-10-02',hours:10},{id:104,room:'alg',title:'Acompanhamento de exercícios',date:'2026-10-09',hours:10}],
  deliveries:[{activityId:1,name:'Bruno Lima',response:'Para cada número, verifico se o resto por 2 é zero e somo os valores pares.',grade:null,feedback:''},{activityId:1,name:'Diego Santos',response:'soma = 0; repita 5 vezes: leia n; se n % 2 == 0: soma += n;',grade:null,feedback:''}]
};
for(const target of [seed,state]){
  for(const [key,value] of Object.entries(flowDefaults))if(!target[key])target[key]=structuredClone(value);
  for(const a of target.activities){a.room=a.room||'alg';if(a.id===1&&a.lessonId===undefined)a.lessonId=1;}
  for(const p of target.attendance){p.room=p.room||'alg';if(p.title==='Laços de repetição na prática'&&p.lessonId===undefined)p.lessonId=1;}
  for(const c of target.certificates){c.room=c.room||'alg';}
}
let trackingQuery='',activityLesson=null,noticeFilter='Todos',certificateFilter='Todos',selectionQuery='',selectionFilter='Todos';

render();







