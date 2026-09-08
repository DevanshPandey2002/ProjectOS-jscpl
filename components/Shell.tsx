'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
export default function Shell({children,role='MD'}:{children:React.ReactNode,role?:string}){
 const pathname=usePathname();
 const nav=[['Dashboard','/dashboard'],['Projects','/projects'],['Lots & Blocks','/lots'],['Schemes','/schemes'],['BOQ & Reconciliation','/boq'],['Pending Approval','/pending-approval'],['Execution','/execution'],['Measurements','/measurements'],['RA Bills','/bills'],['Purchases','/purchases'],['Expenses','/expenses'],['Payments','/payments'],['Project Finance','/finance'],['Reports','/reports'],['Documents','/documents'],['Issues','/issues'],['Users & Roles','/admin/users'],['Audit Log','/audit']];
 return <div className="shell"><aside className="side"><div className="brand"><span className="hommini">H<span>O</span>M</span><span>Hetvi O&amp;M</span></div><div className="nav">{nav.map(([x,u])=>{const active=pathname===u||pathname.startsWith(u+'/');return <Link key={u} href={u} className={active?'active':''}>{x}</Link>})}</div></aside><main className="main"><header className="top"><div><strong>{role}</strong><div className="muted" style={{fontSize:12}}>Hetvi Operation and Maintenance Works</div></div><div className="badge">All Projects</div></header>{children}</main></div>
}
