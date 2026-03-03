const STORAGE_KEY = 'valenero_crm_pro_v3';
const PAGES = ['Overview', 'Leads', 'Pipeline', 'Settings'];

const defaultState = {
  currentBiz: 'biz-1',
  currentPage: 'Overview',
  businesses: [
    { id: 'biz-1', name: 'Our Business' },
    { id: 'biz-2', name: 'Smile Dental Clinic' }
  ],
  leads: {
    'biz-1': [
      { id: 'l-1', name: 'Dr. Johnson', company: 'Bright Smiles', phone: '555-0101', stage: 'New' }
    ],
    'biz-2': [
      { id: 'l-2', name: 'Amy Lee', company: 'Smile Dental', phone: '555-0110', stage: 'Contacted' }
    ]
  },
  deals: { 'biz-1': [], 'biz-2': [] },
  tasks: { 'biz-1': [{ id: 't-1', title: 'Follow up quote' }], 'biz-2': [] }
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function byId(id) { return document.getElementById(id); }

function renderNav() {
  const nav = byId('nav');
  nav.innerHTML = '';
  PAGES.forEach((page) => {
    const btn = document.createElement('button');
    btn.textContent = page;
    if (state.currentPage === page) btn.classList.add('active');
    btn.onclick = () => {
      state.currentPage = page;
      saveState();
      render();
    };
    nav.appendChild(btn);
  });
}

function ensureBizBuckets(id) {
  state.leads[id] ||= [];
  state.deals[id] ||= [];
  state.tasks[id] ||= [];
}

function renderBizSelect() {
  const select = byId('bizSelect');
  select.innerHTML = state.businesses.map((b) => `<option value="${b.id}">${b.name}</option>`).join('');
  select.value = state.currentBiz;
  select.onchange = () => {
    state.currentBiz = select.value;
    ensureBizBuckets(state.currentBiz);
    saveState();
    render();
  };
}

function renderOverview(page) {
  page.appendChild(byId('overviewTpl').content.cloneNode(true));
  const biz = state.currentBiz;
  byId('kpiLeads').textContent = state.leads[biz]?.length || 0;
  byId('kpiDeals').textContent = state.deals[biz]?.length || 0;
  byId('kpiTasks').textContent = state.tasks[biz]?.length || 0;
}

function renderLeads(page) {
  page.appendChild(byId('leadsTpl').content.cloneNode(true));
  const rows = byId('leadsRows');
  const leads = state.leads[state.currentBiz] || [];
  rows.innerHTML = leads.map((lead) => `<tr><td>${lead.name}</td><td>${lead.company}</td><td>${lead.phone || '-'}</td><td>${lead.stage}</td></tr>`).join('');

  byId('leadForm').onsubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    state.leads[state.currentBiz].push({
      id: crypto.randomUUID(),
      name: String(form.get('name') || '').trim(),
      company: String(form.get('company') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      stage: 'New'
    });
    saveState();
    render();
  };
}

function renderPipeline(page) {
  page.appendChild(byId('pipelineTpl').content.cloneNode(true));
  const cols = byId('pipelineCols');
  const stages = ['New', 'Contacted', 'Demo Booked', 'Won'];
  const leads = state.leads[state.currentBiz] || [];
  cols.innerHTML = stages.map((stage) => {
    const items = leads.filter((l) => l.stage === stage).map((l) => `<div class="chip">${l.name}<br><small>${l.company}</small></div>`).join('');
    return `<section class="stage"><h4>${stage}</h4>${items || '<small class="muted">No leads</small>'}</section>`;
  }).join('');
}

function renderSettings(page) {
  page.appendChild(byId('settingsTpl').content.cloneNode(true));
  byId('resetBtn').onclick = () => {
    if (!confirm('Reset all local data to seed defaults?')) return;
    state = structuredClone(defaultState);
    saveState();
    render();
  };
}

function render() {
  renderNav();
  renderBizSelect();
  byId('pageTitle').textContent = state.currentPage;
  const page = byId('page');
  page.innerHTML = '';

  if (state.currentPage === 'Overview') renderOverview(page);
  if (state.currentPage === 'Leads') renderLeads(page);
  if (state.currentPage === 'Pipeline') renderPipeline(page);
  if (state.currentPage === 'Settings') renderSettings(page);
}

function setupBackupControls() {
  byId('exportBtn').onclick = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'valenero-crm-local',
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `valenero-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  byId('importInput').onchange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || parsed.version !== 1 || parsed.app !== 'valenero-crm-local' || typeof parsed.state !== 'object') {
        alert('Invalid backup format.');
        return;
      }
      state = parsed.state;
      ensureBizBuckets(state.currentBiz);
      saveState();
      render();
      alert('Backup imported.');
    } catch {
      alert('Could not parse JSON backup file.');
    } finally {
      event.target.value = '';
    }
  };
}

setupBackupControls();
ensureBizBuckets(state.currentBiz);
render();
