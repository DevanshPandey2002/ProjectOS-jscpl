import Link from 'next/link';
import Shell from '@/components/Shell';

const money=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
const LOT3_APPROVED=20141827;
const LOT4_APPROVED=74186099;
const MASTER_ESTIMATE=94327925.91;
const TRACKED_SCHEMES=93;

export default function Dashboard(){return <Shell><div className='content'>
<h1 className='title'>HQ Control Dashboard</h1>
<p className='muted'>Master Project: Sant Kabir Nagar Rural Water Supply Project</p>
<div className='grid grid4' style={{marginTop:20}}>
{[['Master Estimate',money(MASTER_ESTIMATE)],['Lot 3 Approved',money(LOT3_APPROVED)],['Lot 4 Approved',money(LOT4_APPROVED)],['Tracked Schemes',String(TRACKED_SCHEMES)]].map(x=><div className='card' key={x[0]}><div className='muted'>{x[0]}</div><div className='kpi'>{x[1]}</div></div>)}
</div>
<div className='grid grid3' style={{marginTop:16}}>
<div className='card'><h3>Project Manager</h3><p className='muted'>Enter execution quantities and measurements against approved BOQ.</p><Link className='btn secondary' href='/execution'>Open execution</Link></div>
<div className='card'><h3>Accountant</h3><p className='muted'>Control BOQ, reconciliation, RA bills, purchases, expenses and payments.</p><Link className='btn secondary' href='/boq'>Open BOQ control</Link></div>
<div className='card'><h3>HQ Inspector</h3><p className='muted'>Review lots, schemes, progress, value and exceptions.</p><Link className='btn secondary' href='/reports'>Open reports</Link></div>
</div>
<div className='card' style={{marginTop:16}}><h3>Working hierarchy</h3><p className='muted'>Project → Lot → Block → Scheme → Item → Approved Qty → Executed Qty → Measurement → RA Bill → Purchase → Expense → Payment.</p><Link className='btn' href='/schemes'>View schemes</Link></div>
</div></Shell>}
