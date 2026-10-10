'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { readProjects, readWorkspace, writeWorkspace, type WorkspaceContext } from '@/lib/workspace';

const nav = [
  { label: 'Overview', href: '/dashboard', icon: '◫' },
  { label: 'Projects', href: '/lots', icon: '▦' },
  { label: 'Work Register', href: '/execution', icon: '☷' },
  { label: 'Approvals', href: '/pending-approval', icon: '✓' },
  { label: 'Billing & Receivables', href: '/bills', icon: '▤' },
  { label: 'Stock & Procurement', href: '/purchases', icon: '▧' },
  { label: 'Payments & Cash', href: '/payments', icon: '₹' },
];
const more = [
  ['Schemes', '/schemes'], ['BOQ & Reconciliation', '/boq'], ['Measurements', '/measurements'],
  ['Expenses', '/expenses'], ['Project Finance', '/finance'], ['Reports', '/reports'],
  ['Documents', '/documents'], ['Issues', '/issues'], ['Users & Roles', '/admin/users'], ['Audit Log', '/audit'],
];

export default function Shell({ children, role }: { children: React.ReactNode; role?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceContext>({ role: 'Managing Director', project: 'All Projects' });
  const [projects, setProjects] = useState<string[]>(['Sant Kabir Nagar', 'Siddharth Nagar', 'Mirzapur']);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setWorkspace(readWorkspace());
    setProjects(readProjects());
  }, []);

  const roleName = role || workspace.role;
  const projectScoped = ['Project Manager', 'Storekeeper', 'Field Billing Engineer'].includes(workspace.role);

  function changeProject(project: string) {
    const next = { ...workspace, project: projectScoped ? project : 'All Projects' };
    setWorkspace(next);
    writeWorkspace(next);
    router.refresh();
    window.location.reload();
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/dashboard" className="app-brand">
          <span className="app-brand-mark">H<span>O</span>M</span>
          <span><strong>Hetvi O&amp;M</strong><small>PROJECT OPERATIONS</small></span>
        </Link>
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="app-nav">
          {nav.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return <Link key={item.href} href={item.href} className={active ? 'app-nav-link active' : 'app-nav-link'}><span className="app-nav-icon">{item.icon}</span><span>{item.label}</span></Link>;
          })}
          <button type="button" className={more.some(([,href]) => pathname === href || pathname.startsWith(href + '/')) ? 'app-nav-link active' : 'app-nav-link'} onClick={() => setMoreOpen(v => !v)}><span className="app-nav-icon">•••</span><span>More modules</span><span className="app-nav-chevron">{moreOpen ? '−' : '+'}</span></button>
          {moreOpen && <div className="app-nav-sub">{more.map(([label, href]) => <Link key={href} href={href} className={pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}>{label}</Link>)}</div>}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-status-dot" /><span>Frontend demo mode</span></div>
      </aside>
      <main className="app-main">
        <header className="app-topbar">
          <div className="app-top-context"><span className="topbar-kicker">HETVI OPERATION AND MAINTENANCE WORKS</span><strong>{workspace.project === 'All Projects' ? 'Organization workspace' : workspace.project}</strong></div>
          <div className="app-top-actions">
            <label className="top-role-label"><span>Role</span><select aria-label="Working role" value={workspace.role} onChange={e => { const next = { ...workspace, role: e.target.value as WorkspaceContext['role'], project: ['Project Manager','Storekeeper','Field Billing Engineer'].includes(e.target.value) ? (workspace.project === 'All Projects' ? projects[0] : workspace.project) : 'All Projects' }; setWorkspace(next); writeWorkspace(next); window.location.reload(); }}>{['Managing Director','Accountant','Admin','Project Manager','Storekeeper','Field Billing Engineer'].map(r => <option key={r}>{r}</option>)}</select></label>
            <label className="top-project-label"><span>Project</span><select aria-label="Current project" value={projectScoped ? (workspace.project === 'All Projects' ? projects[0] : workspace.project) : 'All Projects'} onChange={e => changeProject(e.target.value)}>{!projectScoped && <option>All Projects</option>}{projects.map(p => <option key={p}>{p}</option>)}</select></label>
            <Link href="/login" className="switch-workspace">Switch workspace ↗</Link>
          </div>
        </header>
        <div className="demo-banner"><span>DEMO MODE</span> Changes are saved in this browser only. Login, API, database and access controls are not connected yet.</div>
        {children}
      </main>
    </div>
  );
}
