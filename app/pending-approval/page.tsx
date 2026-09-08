'use client';
import Link from 'next/link';
import Shell from '@/components/Shell';

const money=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
const snapshot={schemes:84,itemRows:36984,pendingValue:822952178.33};

export default function PendingApproval(){
 return <Shell><div className='content'>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
   <div><h1 className='title'>Pending Approval</h1><p className='muted'>Master BOQ reconciliation against Lot 3 and Lot 4 approved quantities.</p></div>
   <Link className='btn' href='/boq'>BOQ & Reconciliation</Link>
  </div>
  <div className='grid grid4' style={{marginTop:18}}>
   <div className='card'><div className='muted'>Master Schemes</div><div className='kpi'>{snapshot.schemes}</div><div className='muted' style={{fontSize:12}}>Reconciliation snapshot</div></div>
   <div className='card'><div className='muted'>Master Item Rows</div><div className='kpi'>{snapshot.itemRows.toLocaleString('en-IN')}</div><div className='muted' style={{fontSize:12}}>Item-level control</div></div>
   <div className='card'><div className='muted'>Pending Approval Value</div><div className='kpi'>{money(snapshot.pendingValue)}</div><div className='muted' style={{fontSize:12}}>Before approval / allocation</div></div>
   <div className='card'><div className='muted'>Approval Status</div><div className='kpi' style={{fontSize:22}}>Pending</div><div className='muted' style={{fontSize:12}}>Requires review</div></div>
  </div>
  <div className='card' style={{marginTop:16}}>
   <h3>Approval calculation</h3>
   <p className='muted'>For each Project + Lot + Block + Scheme + Item Code + Unit, the system compares the master/estimate quantity with quantities already allocated to Lot 3 and Lot 4.</p>
   <div className='grid grid3' style={{marginTop:14}}>
    <div><b>Pending Qty</b><div className='muted'>Master Qty − Lot 3 Qty − Lot 4 Qty</div></div>
    <div><b>Pending Amount</b><div className='muted'>Pending Qty × applicable rate</div></div>
    <div><b>Control</b><div className='muted'>Negative balance is flagged for reconciliation; no silent overwrite.</div></div>
   </div>
  </div>
  <div className='card' style={{marginTop:16}}>
   <h3>Approval workflow</h3>
   <div className='grid grid4' style={{marginTop:12}}>
    <div><b>1. Master</b><div className='muted'>Estimate / CBOQ baseline</div></div>
    <div><b>2. Reconcile</b><div className='muted'>Deduct Lot 3 + Lot 4 approved quantities</div></div>
    <div><b>3. Review</b><div className='muted'>Resolve missing, new, rate and over-allocation items</div></div>
    <div><b>4. Approve</b><div className='muted'>Lock approved quantities for execution</div></div>
   </div>
  </div>
  <div className='card' style={{marginTop:16}}>
   <h3>Important</h3>
   <p className='muted'>This screen is the imported reconciliation snapshot. The production approval action should be persisted in PostgreSQL with an immutable audit trail before it is used for live financial control.</p>
  </div>
 </div></Shell>
}
