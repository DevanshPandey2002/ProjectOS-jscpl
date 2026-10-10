'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_PROJECTS, PROJECTS_KEY, WORKSPACE_ROLES, writeWorkspace, type WorkspaceRole } from '@/lib/workspace';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<WorkspaceRole>('Project Manager');
  const [project, setProject] = useState('Sant Kabir Nagar');
  const [projects, setProjects] = useState<string[]>(DEFAULT_PROJECTS);
  const [newProject, setNewProject] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(PROJECTS_KEY) || '[]');
      if (Array.isArray(stored)) {
        const list = Array.from(new Set([...DEFAULT_PROJECTS, ...stored.filter((x): x is string => typeof x === 'string' && x.trim()).map((x: string) => x.trim())]));
        setProjects(list);
        if (!list.includes(project)) setProject(list[0]);
      }
    } catch {
      setProjects(DEFAULT_PROJECTS);
    }
  }, []);

  const needsProject = role === 'Project Manager' || role === 'Storekeeper' || role === 'Field Billing Engineer';
  const activeProject = needsProject ? project : 'All Projects';

  function addProject() {
    const name = newProject.trim();
    if (!name) { setNotice('Enter a project name first.'); return; }
    if (projects.some(x => x.toLowerCase() === name.toLowerCase())) {
      setNotice('That project is already in the list.');
      setProject(projects.find(x => x.toLowerCase() === name.toLowerCase()) || name);
      return;
    }
    const next = [...projects, name];
    setProjects(next);
    setProject(name);
    setNewProject('');
    setShowAddProject(false);
    setNotice('Project added to this browser demo. No database record has been created.');
    try { window.localStorage.setItem(PROJECTS_KEY, JSON.stringify(next)); } catch {}
  }

  function enterWorkspace() {
    writeWorkspace({ role, project: activeProject });
    router.push('/dashboard');
  }

  return (
    <main className="workspace-login">
      <div className="workspace-glow workspace-glow-one" />
      <div className="workspace-glow workspace-glow-two" />
      <section className="workspace-card">
        <div className="workspace-brand-row">
          <div className="workspace-mark" aria-label="Hetvi O and M mark"><span>H</span><i>O</i><span>M</span></div>
          <div><div className="workspace-brand-name">Hetvi O&amp;M</div><div className="workspace-company-name">Hetvi Operation and Maintenance Works</div></div>
          <span className="demo-chip">FRONTEND DEMO</span>
        </div>
        <div className="workspace-intro">
          <div className="workspace-eyebrow">PROJECT OPERATIONS WORKSPACE</div>
          <h1>Good work starts<br />with a clear picture.</h1>
          <p>Choose your working role and project to open the operations dashboard.</p>
        </div>
        <div className="workspace-form">
          <label className="workspace-label">Working as
            <select value={role} onChange={e => { setRole(e.target.value as WorkspaceRole); setNotice(''); }} className="workspace-select">
              {WORKSPACE_ROLES.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
          {needsProject && <div className="workspace-label">Current project
            <div className="workspace-project-row">
              <select value={project} onChange={e => { setProject(e.target.value); setNotice(''); }} className="workspace-select">
                {projects.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <button className="workspace-add-btn" type="button" onClick={() => setShowAddProject(v => !v)} aria-label="Add project">+</button>
            </div>
          </div>}
          {!needsProject && <div className="workspace-scope"><span className="workspace-scope-dot" />Organization-wide workspace <small>All projects</small></div>}
          {showAddProject && <div className="workspace-add-panel">
            <label className="workspace-label">New project name<input className="workspace-select" value={newProject} onChange={e => setNewProject(e.target.value)} placeholder="e.g. Gorakhpur Water Supply" onKeyDown={e => { if (e.key === 'Enter') addProject(); }} /></label>
            <button type="button" className="workspace-add-save" onClick={addProject}>Add to project list</button>
          </div>}
          {notice && <p className="workspace-notice" role="status">{notice}</p>}
          <button className="workspace-enter" type="button" onClick={enterWorkspace}>Open workspace <span>→</span></button>
          <p className="workspace-disclaimer"><strong>Demo mode:</strong> no email, password, or database login is used. Project selection is stored in this browser only and is not a security boundary.</p>
        </div>
        <footer className="workspace-footer"><span>H–O–M · Built for field-to-HQ clarity</span><span>Operations · Materials · Billing</span></footer>
      </section>
    </main>
  );
}
