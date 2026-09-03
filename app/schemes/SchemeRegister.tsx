'use client';
import {useMemo,useState} from 'react';
import type {BoqRow} from '@/lib/boqData';

export default function SchemeRegister({rows}:{rows:BoqRow[]}){
 const [lot,setLot]=useState('All Lots');
 const [q,setQ]=useState('');
 const schemes=useMemo(()=>{const m=new Map<string,{lot:string;id:string|null;name:string;block:string;items:number;value:number}>();for(const r of rows){if(lot!=='All Lots'&&r.lot!==lot)continue;const k=[r.lot,r.schemeId||'',r.schemeName].join('|');const x=m.get(k)||{lot:r.lot,id:r.schemeId,name:r.schemeName,block:r.block,items:0,value:0};x.items++;x.value+=typeof r.rate==='number'?r.rate*r.approvedQty:0;m.set(k,x)}return Array.from(m.values()).filter(x=>!q||[x.name,x.id,x.block,x.lot].join(' ').toLowerCase().includes(q.toLowerCase())).sort((a,b)=>b.value-a.value)},[rows,lot,q]);
 return <div className='card'><div className='toolbar'><select className='input' value={lot} onChange={e=>setLot(e.target.value)}><option>All Lots</option>{Array.from(new Set(rows.map(r=>r.lot))).sort().map(x=><option key={x}>{x}</option>)}</select><input className='input' placeholder='Search schemes…' value={q} onChange={e=>setQ(e.target.value)}/></div><table className='table'><thead><tr><th>Lot</th><th>Scheme ID</th><th>Scheme</th><th>Block</th><th>Items</th><th>Approved Value</th></tr></thead><tbody>{schemes.map(x=><tr key={x.lot+'|'+x.name}><td>{x.lot}</td><td>{x.id||'—'}</td><td><b>{x.name}</b></td><td>{x.block}</td><td>{x.items}</td><td>₹{Math.round(x.value).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div>;
}
