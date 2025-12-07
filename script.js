const STORAGE_KEY = 'projectflow_v1';
const USERS_STORAGE = 'projectflow_users';

let currentUser = null;
let state = {};

let selectedColor = '#667eea';

function switchAuthForm(){
  byId('loginForm').classList.toggle('active');
  byId('signupForm').classList.toggle('active');
}

function handleLogin(e){
  e.preventDefault();
  const email = byId('loginEmail').value.trim();
  const password = byId('loginPassword').value;
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE) || '{}');
  
  if(users[email] && users[email].password === password){
    currentUser = {email, name: users[email].name};
    localStorage.setItem('projectflow_current', JSON.stringify(currentUser));
    loadUserData(false);
    byId('authScreen').classList.add('hidden');
    initializeApp();
  } else {
    alert('Invalid email or password');
  }
}

function handleSignup(e){
  e.preventDefault();
  const name = byId('signupName').value.trim();
  const email = byId('signupEmail').value.trim();
  const password = byId('signupPassword').value;
  const confirm = byId('signupConfirm').value;
  
  if(password !== confirm){
    alert('Passwords do not match');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE) || '{}');
  if(users[email]){
    alert('Email already registered');
    return;
  }
  
  users[email] = {name, password};
  localStorage.setItem(USERS_STORAGE, JSON.stringify(users));
  currentUser = {email, name};
  localStorage.setItem('projectflow_current', JSON.stringify(currentUser));
  loadUserData(true);
  byId('authScreen').classList.add('hidden');
  initializeApp();
}

function logout(){
  if(confirm('Are you sure you want to logout?')){
    currentUser = null;
    localStorage.removeItem('projectflow_current');
    byId('authScreen').classList.remove('hidden');
    document.querySelectorAll('.page').forEach(p=> p.style.display = 'none');
  }
}

function checkAuth(){
  const stored = localStorage.getItem('projectflow_current');
  if(stored){
    currentUser = JSON.parse(stored);
    loadUserData(false);
    byId('authScreen').classList.add('hidden');
    initializeApp();
  }
}

function uid(prefix='id'){
  return prefix + '_' + Math.random().toString(36).slice(2,9);
}

function nowDate(){
  return new Date().toISOString().split('T')[0];
}

function seedDataEmpty(){
  return { projects:[], tasks:[], members:[] };
}

function seedDataRich(){
  return {
    projects:[
      {id:uid('p'),name:'Website Redesign',description:'Refresh marketing site',status:'in-progress',due:'2025-01-22',color:'#667eea',created:nowDate()},
      {id:uid('p'),name:'Mobile App',description:'iOS/Android release',status:'planning',due:'2025-03-01',color:'#5e4db0',created:nowDate()},
      {id:uid('p'),name:'Cloud Migration',description:'AWS cloud migration',status:'review',due:'2025-02-15',color:'#36b37e',created:nowDate()},
    ],
    tasks:[
      {id:uid('t'),title:'Design mockups',projectId:null,priority:'high',status:'todo',assignee:null,due:'2024-12-15',created:nowDate(),description:''},
      {id:uid('t'),title:'API integration',projectId:null,priority:'high',status:'in-progress',assignee:null,due:'2024-12-20',created:nowDate(),description:''},
      {id:uid('t'),title:'Testing',projectId:null,priority:'medium',status:'todo',assignee:null,due:'2024-12-25',created:nowDate(),description:''},
    ],
    members:[
      {id:uid('m'),name:'Alice Johnson',email:'alice@example.com',role:'Designer'},
      {id:uid('m'),name:'Bob Smith',email:'bob@example.com',role:'Developer'},
    ],
  };
}

function loadUserData(isNewUser=false){
  if(!currentUser) return;
  const storageKey = STORAGE_KEY + '_' + currentUser.email;
  const raw = localStorage.getItem(storageKey);
  
  if(!raw){
    state = isNewUser ? seedDataEmpty() : seedDataRich();
    saveState();
  } else {
    try{ state = JSON.parse(raw); }catch(e){ state = seedDataRich(); }
  }
  updateUserDisplay();
}

function saveState(){
  if(!currentUser) return;
  localStorage.setItem(STORAGE_KEY + '_' + currentUser.email, JSON.stringify(state));
}

function updateUserDisplay(){
  if(currentUser){
    byId('userDisplayName').innerText = currentUser.name;
    byId('userDisplayInitials').innerText = (currentUser.name||'').split(' ').map(x=>x[0]||'').join('').slice(0,2).toUpperCase();
  }
}

function byId(id){ return document.getElementById(id); }

function switchTab(e){
  const tab = e?.target?.closest('.nav-item')?.dataset?.tab || e;
  if(!tab) return;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.tab===tab));
  ['dashboard','projects','tasks','team'].forEach(id=>{const el=byId(id); if(el) el.style.display = id===tab ? 'block' : 'none'});
  renderAll();
}

function openModal(id){ byId(id).classList.add('show'); document.body.style.overflow='hidden'; }
function closeModal(id){ byId(id).classList.remove('show'); document.body.style.overflow=''; }

document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('modal')){ closeModal(e.target.id); }
});

function openProjectModal(editId){
  resetProjectForm();
  populateColorPicker();
  if(editId){
    const p = state.projects.find(x=>x.id===editId);
    if(p){
      byId('projectId').value = p.id;
      byId('projectName').value = p.name;
      byId('projectDescription').value = p.description;
      byId('projectStatus').value = p.status;
      byId('projectDueDate').value = p.due;
      selectColor(p.color);
      byId('projectModalTitle').innerText='Edit Project';
    }
  } else { byId('projectModalTitle').innerText='New Project'; }
  openModal('projectModal');
}
function closeProjectModal(){ closeModal('projectModal'); }

function resetProjectForm(){ ['projectId','projectName','projectDescription','projectDueDate'].forEach(id=>{ if(byId(id)) byId(id).value=''; }); selectedColor = null; }

function saveProject(e){
  e.preventDefault();
  const id = byId('projectId').value;
  const name = byId('projectName').value.trim();
  if(!name) return alert('Project name required');
  const due = byId('projectDueDate').value;
  if(!due) return alert('Due date required');
  const obj = {name,description:byId('projectDescription').value.trim(),status:byId('projectStatus').value,due:due,color:selectedColor||'#667eea'};
  if(id){
    const i = state.projects.findIndex(p=>p.id===id);
    if(i>-1) state.projects[i] = {...state.projects[i],...obj};
  } else {
    const p = {id:uid('p'),...obj,created:nowDate()};
    state.projects.unshift(p);
  }
  saveState();
  populateProjectOptions();
  closeProjectModal();
  renderAll();
}

function openTaskModal(editId){
  resetTaskForm();
  populateProjectOptions();
  populateMemberOptions();
  if(editId){
    const t = state.tasks.find(x=>x.id===editId);
    if(t){
      byId('taskId').value=t.id;
      byId('taskTitle').value=t.title;
      byId('taskDescription').value=t.description;
      byId('taskPriority').value=t.priority;
      byId('taskStatus').value=t.status;
      byId('taskProject').value=t.projectId || '';
      byId('taskAssignee').value=t.assignee || '';
      byId('taskDueDate').value=t.due;
      byId('taskModalTitle').innerText='Edit Task';
    }
  } else byId('taskModalTitle').innerText='New Task';
  openModal('taskModal');
}
function closeTaskModal(){ closeModal('taskModal'); }

function resetTaskForm(){ ['taskId','taskTitle','taskDescription','taskDueDate'].forEach(id=>{ if(byId(id)) byId(id).value=''; }); if(byId('taskPriority')) byId('taskPriority').value='low'; if(byId('taskStatus')) byId('taskStatus').value='todo'; }

function saveTask(e){
  e.preventDefault();
  const id = byId('taskId').value;
  const title = byId('taskTitle').value.trim();
  if(!title) return alert('Task title required');
  const due = byId('taskDueDate').value;
  if(!due) return alert('Due date required');
  const obj = {title,description:byId('taskDescription').value,priority:byId('taskPriority').value,status:byId('taskStatus').value,projectId:byId('taskProject').value||null,assignee:byId('taskAssignee').value||null,due:due};
  if(id){
    const i = state.tasks.findIndex(t=>t.id===id);
    if(i>-1) state.tasks[i] = {...state.tasks[i],...obj};
  } else {
    const t = {id:uid('t'),...obj,created:nowDate()};
    state.tasks.unshift(t);
  }
  saveState();
  closeTaskModal();
  renderAll();
}

function openTeamModal(editId){
  resetTeamForm();
  if(editId){
    const m = state.members.find(x=>x.id===editId);
    if(m){
      byId('memberId').value=m.id;
      byId('memberName').value=m.name;
      byId('memberEmail').value=m.email;
      byId('memberRole').value=m.role;
      byId('teamModalTitle').innerText='Edit Member';
    }
  } else byId('teamModalTitle').innerText='Invite Member';
  openModal('teamModal');
}
function closeTeamModal(){ closeModal('teamModal'); }

function resetTeamForm(){ ['memberId','memberName','memberEmail','memberRole'].forEach(id=>{ if(byId(id)) byId(id).value=''; }); }

function saveMember(e){
  e.preventDefault();
  const id = byId('memberId').value;
  const name = byId('memberName').value.trim();
  const email = byId('memberEmail').value.trim();
  const role = byId('memberRole').value.trim();
  if(!name||!email) return alert('Name and email required');
  if(id){
    const i = state.members.findIndex(m=>m.id===id);
    if(i>-1) state.members[i] = {...state.members[i],name,email,role};
  } else {
    const m = {id:uid('m'),name,email,role};
    state.members.unshift(m);
  }
  saveState();
  populateMemberOptions();
  closeTeamModal();
  renderAll();
}

function populateProjectOptions(selectedId = null, elementId = 'taskProject') {
  const sel = byId(elementId);
  if (!sel) return;
  sel.innerHTML = '';
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = '(none)';
  sel.appendChild(empty);
  (state.projects || []).forEach(p => {
    const o = document.createElement('option');
    o.value = p.id;
    o.textContent = p.name || p.title || 'Untitled';
    if (selectedId && p.id === selectedId) o.selected = true;
    sel.appendChild(o);
  });
}

function populateMemberOptions(selectedId = null, elementId = 'taskAssignee') {
  const sel = byId(elementId);
  if (!sel) return;
  sel.innerHTML = '';
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = 'Unassigned';
  sel.appendChild(empty);
  (state.members || []).forEach(m => {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = m.name || m.email || 'Member';
    if (selectedId && m.id === selectedId) o.selected = true;
    sel.appendChild(o);
  });
}

function populateColorPicker() {
  const container = byId('projectColorPicker');
  if (!container) return;
  const colors = ['#667eea', '#5e4db0', '#36b37e', '#f5cd47', '#ae2a19', '#60a5fa', '#f97316'];
  container.innerHTML = '';
  colors.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-option';
    btn.dataset.color = c;
    btn.style.background = c;
    btn.addEventListener('click', () => selectColor(c));
    if (selectedColor && selectedColor.toLowerCase() === c.toLowerCase()) btn.classList.add('selected');
    container.appendChild(btn);
  });
}

function selectColor(color) {
  selectedColor = color;
  document.querySelectorAll('.color-option').forEach(b => {
    b.classList.toggle('selected', b.dataset.color === color);
  });
}

function renderAll(){
  renderStats();
  renderDashboardProjects();
  renderDashboardTasks();
  renderProjects();
  renderTasks();
  renderTeam();
}

function renderStats(){
  const projects = state.projects.length;
  const tasks = state.tasks.length;
  const members = state.members.length;
  const completed = state.tasks.filter(t=>t.status==='completed').length;
  const statsGrid = byId('statsGrid');
  if(!statsGrid) return;
  statsGrid.innerHTML = '';
  const templates = [{number:projects,label:'Projects'}, {number:tasks,label:'Tasks'}, {number:members,label:'Members'}, {number:completed,label:'Completed'}];
  templates.forEach(s=>{ const card=document.createElement('div');card.className='stat-card';card.innerHTML=`<div class="stat-number">${s.number}</div><div class="stat-label">${s.label}</div>`; statsGrid.appendChild(card);});
}

function renderDashboardProjects(){
  const container = byId('dashboardProjects');
  if(!container) return;
  container.innerHTML='';
  const list = state.projects.slice(0,6);
  if(list.length === 0){
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding=60px 20px;color:var(--text-tertiary)"><i class="fa-solid fa-inbox" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.5"></i><p>No projects yet. Create your first project!</p></div>';
    return;
  }
  list.forEach(p=>{ 
    const el=document.createElement('div'); 
    el.className='project-card'; 
    el.innerHTML = `
      <div class="project-name">${escapeHtml(p.name)}</div>
      <div class="project-desc">${escapeHtml(p.description||'')}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${projectProgress(p.id)}%"></div></div>
      <div class="project-footer">
        <div class="project-meta">
          <span class="badge ${statusClass(p.status)}">${toTitle(p.status)}</span>
          <span style="margin-left:auto">${projectProgress(p.id)}%</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:14px">
        <button class="btn btn-ghost" onclick="openProjectModal('${p.id}')" type="button"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-ghost" onclick="deleteProject('${p.id}')" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderProjects(){
  const container = byId('projectsGrid');
  if(!container) return;
  container.innerHTML='';
  const list = state.projects.slice();
  if(list.length === 0){
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding=60px 20px;color:var(--text-tertiary)"><i class="fa-solid fa-inbox" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.5"></i><p>No projects yet. Create your first project!</p></div>';
    return;
  }
  list.forEach(p=>{
    const el=document.createElement('div');
    el.className='project-card';
    el.innerHTML=`
      <div class="project-name">${escapeHtml(p.name)}</div>
      <div class="project-desc">${escapeHtml(p.description||'')}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${projectProgress(p.id)}%"></div></div>
      <div class="project-footer">
        <div class="project-meta">
          <span class="badge ${statusClass(p.status)}">${toTitle(p.status)}</span>
          <span style="margin-left:auto">${projectProgress(p.id)}%</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-top:14px">
        <button class="btn btn-ghost" onclick="openProjectModal('${p.id}')" type="button"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-ghost" onclick="deleteProject('${p.id}')" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderDashboardTasks(){
  const container = byId('dashboardTasks');
  if(!container) return;
  container.innerHTML='';
  const list = state.tasks.slice(0,8);
  if(list.length === 0){
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-tertiary)"><i class="fa-solid fa-inbox" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.5"></i><p>No tasks yet. Create your first task!</p></div>';
    return;
  }
  list.forEach(t=>{
    const el=document.createElement('div');
    el.className='task-item';
    el.innerHTML=`
      <input type="checkbox" class="task-checkbox" ${t.status==='completed'?'checked':''} onchange="toggleTaskStatus('${t.id}', this.checked)">
      <div class="task-content">
        <div class="task-title">${escapeHtml(t.title)}</div>
        <div class="task-meta">${memberName(t.assignee)} • Due ${t.due || '—'}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div class="badge ${priorityClass(t.priority)}">${t.priority}</div>
        <div class="badge ${statusClass(t.status)}" style="margin-top:4px">${toTitle(t.status)}</div>
      </div>
      <div class="task-actions">
        <button class="btn btn-ghost" onclick="openTaskModal('${t.id}')" type="button"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-ghost" onclick="deleteTask('${t.id}')" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderTasks(){
  const container = byId('tasksGrid');
  if(!container) return;
  container.innerHTML='';
  const list = state.tasks.slice();
  if(list.length === 0){
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-tertiary)"><i class="fa-solid fa-inbox" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.5"></i><p>No tasks yet. Create your first task!</p></div>';
    return;
  }
  list.forEach(t=>{ 
    const el=document.createElement('div'); 
    el.className='task-item'; 
    const project = state.projects.find(p=>p.id===t.projectId); 
    el.innerHTML=`
      <input type="checkbox" class="task-checkbox" ${t.status==='completed'?'checked':''} onchange="toggleTaskStatus('${t.id}', this.checked)">
      <div class="task-content">
        <div class="task-title">${escapeHtml(t.title)} ${project?'<span style="color:var(--text-secondary)">• '+escapeHtml(project.name)+'</span>':''}</div>
        <div class="task-meta">${escapeHtml(t.description||'Unassigned')}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">Due ${t.due||'—'}</div>
        <div style="display:flex;gap:4px;justify-content:flex-end">
          <div class="badge ${priorityClass(t.priority)}">${t.priority}</div>
          <div class="badge ${statusClass(t.status)}">${toTitle(t.status)}</div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-ghost" onclick="openTaskModal('${t.id}')" type="button"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-ghost" onclick="deleteTask('${t.id}')" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderTeam(){
  const container = byId('teamGrid');
  if(!container) return;
  container.innerHTML='';
  if(state.members.length === 0){
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding=60px 20px;color:var(--text-tertiary)"><i class="fa-solid fa-users" style="font-size:48px;margin-bottom:16px;display:block;opacity:0.5"></i><p>No team members yet. Invite someone!</p></div>';
    return;
  }
  state.members.forEach(m=>{ 
    const el=document.createElement('div'); 
    el.className='team-card'; 
    el.innerHTML=`
      <div class="team-avatar">${initials(m.name)}</div>
      <div class="team-name">${escapeHtml(m.name)}</div>
      <div class="team-role">${escapeHtml(m.role)}</div>
      <div class="team-email">${escapeHtml(m.email)}</div>
      <div style="display:flex;gap:6px;margin-top:14px;justify-content:center">
        <button class="btn btn-ghost" onclick="openTeamModal('${m.id}')" type="button"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn btn-ghost" onclick="deleteMember('${m.id}')" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(el);
  });
}

function toTitle(s){ if(!s) return ''; return s.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ') }
function statusClass(s){ return 'status-'+(s || 'todo') }
function priorityClass(p){ return 'priority-'+(p||'low') }
function memberName(id){ const m = state.members.find(x=>x.id===id); return m ? m.name : 'Unassigned' }
function initials(name){ return (name||'').split(' ').map(x=>x[0]||'').join('').slice(0,2).toUpperCase() }
function escapeHtml(s){ if(s===undefined || s===null) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }
function projectProgress(projectId){ const tasks = state.tasks.filter(t=>t.projectId===projectId); if(tasks.length===0) return 0; const done = tasks.filter(t=>t.status==='completed').length; return Math.round((done/tasks.length)*100); }

function deleteProject(id){ if(!confirm('Delete this project?')) return; state.projects = state.projects.filter(p=>p.id!==id); state.tasks = state.tasks.filter(t=>t.projectId !== id); saveState(); populateProjectOptions(); renderAll(); }
function deleteTask(id){ if(!confirm('Delete this task?')) return; state.tasks = state.tasks.filter(t=>t.id!==id); saveState(); renderAll(); }
function deleteMember(id){ if(!confirm('Remove this member?')) return; state.members = state.members.filter(m=>m.id!==id); state.tasks = state.tasks.map(t=>{ if(t.assignee===id) t.assignee=null; return t }); saveState(); renderAll(); }

function openExport(){ byId('exportModal').classList.add('show'); }
function closeExport(){ byId('exportModal').classList.remove('show'); }
function openImport(){ byId('importModal').classList.add('show'); }
function closeImport(){ byId('importModal').classList.remove('show'); }

function exportData(){
  const dataStr = JSON.stringify(state,null,2);
  const blob = new Blob([dataStr],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download = 'projectflow-export.json';
  a.click();
  URL.revokeObjectURL(url);
  closeExport();
}

function importData(){
  const f = byId('importFile')?.files?.[0];
  if(!f) return alert('Select a file');
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const parsed = JSON.parse(e.target.result);
      if(confirm('Replace current data?')){
        state = parsed;
        saveState();
        renderAll();
        alert('Import complete');
        closeImport();
      }
    }catch(err){
      alert('Invalid file');
    }
  };
  reader.readAsText(f);
}

function initializeApp(){
  renderAll();
  populateColorPicker();
  populateProjectOptions();
  populateMemberOptions();
  switchTab('dashboard');
}

window.addEventListener('load', checkAuth);