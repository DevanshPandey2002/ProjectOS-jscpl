'use client';
import Link from 'next/link';
import Shell from '@/components/Shell';

export default function NoProjectData({ project }: { project?: string }) {
  return <Shell><div className="content">
    <div className="workspace-eyebrow">PROJECT DATA NOT IMPORTED</div>
    <h1 className="title">{project || 'Selected project'} workspace is ready</h1>
    <div className="card" style={{marginTop:16,maxWidth:760}}>
      <h3 style={{marginTop:0}}>No approved BOQ is linked to this project yet.</h3>
      <p className="muted" style={{fontSize:13,lineHeight:1.8}}>The current bundled approved-item dataset contains Lot 3 and Lot 4 for Sant Kabir Nagar. Other project names can be selected or added in this frontend demo, but their project BOQ and transaction data have not been imported. We are deliberately not showing Sant Kabir Nagar figures under another project.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}><Link className="btn" href="/login">Switch project</Link><Link className="btn secondary" href="/lots">View available project data</Link></div>
    </div>
  </div></Shell>;
}
