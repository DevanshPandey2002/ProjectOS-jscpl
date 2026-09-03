'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import {loadBoqData,type BoqRow} from '@/lib/boqData';

const money=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
const value=(r:BoqRow)=>typeof r.rate==='number'?r.rate*r.approvedQty:0;
type Group={name:string;items:number;schemes:number;value:number;qty:number};

function Bar({pct}:{pct:number}){return <div style={{height:10,background:'#e5e7eb',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:Math.max(0,Math.min(100,pct))+'%',background:'#2563eb',borderRadius:99}}/></div>}

export default function LotsPage(){
 const [rows,setRows]=useState<BoqRow[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [lot,setLot]=useState('All Lots'),[block,setBlock]=useState('All Blocks'),[search,setSearch]=useState('');
 useEffect(()=>{loadBoqData().then(setRows).catch(e=>setError(e instanceof Error?e.message:'Unable to load BOQ')).finally(()=>setLoading(false))},[]);
 const lots=useMemo(()=>Array.from(new Set(rows.map(r=>r.lot))).sort(),[rows]);
 const blocks=useMemo(()=>Array.from(new Set(rows.filter(r=>lot==='All Lots'||r.lot===lot).map(r=>r.block).filter(Boolean))).sort(),[rows,lot]);
 const lotGroups=useMemo<Group[]>(()=>lots.map(name=>{const a=rows.filter(r=>r.lot===name);return{name,items:a.length,schemes:new Set(a.map(r=>r.schemeName)).size,value:a.reduce((s,r)=>s+value(r),0),qty:a.reduce((s,r)=>s+r.approvedQty,0)}}),[rows,lots]);
 const blockGroups=useMemo<Group[]>(()=>{const m=new Map<string,Group>();for(const r of rows){if(lot!=='All Lots'&&r.lot!==lot)continue;if(block!=='All Blocks'&&r.block!==block)continue;const name=r.block||'Unassigned';const x=m.get(name)||{name,items:0,schemes:0,value:0,qty:0};x.items++;x.value+=value(r);x.qty+=r.approvedQty;m.set(name,x)}for(const x of m.values()){x.schemes=new Set(rows.filter(r=>(lot==='All Lots'||r.lot===lot)&&(block==='All Blocks'||r.block===x.name)).map(r=>r.schemeName)).size}return Array.from(m.values()).sort((a,b)=>b.value-a.value)},[rows,lot,block]);
 const visibleLots=lotGroups.filter(x=>lot==='All Lots'||x.name===lot);
 const visibleBlocks=blockGroups.filter(x=>!search||x.name.toLowerCase().includes(search.toLowerCase()));
 const selectedRows=rows.filter(r=>(lot==='All Lots'||r.lot===lot)&&(block==='All Blocks'||r.block===block));
 const selectedValue=selectedRows.reduce((s,r)=>s+value(r),0),selectedSchemes=new Set(selectedRows.map(r=>r.schemeName)).size;
 if(loading)return <Shell><div className='content'><h1 className='title'>Lots & Blocks</h1><p className='muted'>Loading Lot 3 and Lot 4 structure…</p></div></Shell>;
 if(error)return <Shell><div className='content'><h1 className='title'>Lots & Blocks</h1><div className='card'>{error}</div></div></Shell>;
 const maxLot=Math.max(...lotGroups.map(x=>x.value),1),maxBlock=Math.max(...blockGroups.map(x=>x.value),1);
 return <Shell><div className='content'>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><div><h1 className='title'>Lots & Blocks Control</h1><p className='muted'>Execution segmentation of the approved project BOQ. Select a Lot, then a Block, then drill into its schemes.</p></div><Link className='btn' href='/schemes'>Open Scheme Register</Link></div>
  <div className='grid grid4' style={{marginTop:18}}><div className='card'><div className='muted'>Lots</div><div className='kpi'>{lots.length}</div></div><div className='card'><div className='muted'>Blocks</div><div className='kpi'>{new Set(rows.map(r=>r.block).filter(Boolean)).size}</div></div><div className='card'><div className='muted'>Schemes in selection</div><div className='kpi'>{selectedSchemes}</div></div><div className='card'><div className='muted'>Approved value in selection</div><div className='kpi'>{money(selectedValue)}</div></div></div>
  <div className='grid grid3' style={{marginTop:16}}>
   <div className='card' style={{gridColumn:'span 2'}}><h3>Lot value chart</h3><p className='muted'>Approved BOQ value by contractual lot.</p>{lotGroups.map(x=><div key={x.name} style={{marginTop:15}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}><b>{x.name}</b><span>{money(x.value)}</span></div><Bar pct={x.value/maxLot*100}/><div className='muted' style={{fontSize:12,marginTop:4}}>{x.schemes} schemes · {x.items.toLocaleString('en-IN')} BOQ items</div></div>)}</div>
   <div className='card'><h3>Selection</h3><div className='form'><label>Lot<select className='input' value={lot} onChange={e=>{setLot(e.target.value);setBlock('All Blocks')}}><option>All Lots</option>{lots.map(x=><option key={x}>{x}</option>)}</select></label><label>Block<select className='input' value={block} onChange={e=>setBlock(e.target.value)}><option>All Blocks</option>{blocks.map(x=><option key={x}>{x}</option>)}</select></label><input className='input' placeholder='Search blocks…' value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
  </div>
  <div className='card' style={{marginTop:16,overflowX:'auto'}}><h3>Lots</h3><table className='table'><thead><tr><th>Lot</th><th>Approved Schemes</th><th>BOQ Items</th><th>Approved Qty</th><th>Approved Value</th><th>Share of combined</th><th></th></tr></thead><tbody>{visibleLots.map(x=><tr key={x.name}><td><b>{x.name}</b></td><td>{x.schemes}</td><td>{x.items.toLocaleString('en-IN')}</td><td>{x.qty.toLocaleString('en-IN',{maximumFractionDigits:3})}</td><td><b>{money(x.value)}</b></td><td style={{minWidth:170}}>{<><Bar pct={selectedValue?x.value/Math.max(lotGroups.reduce((s,a)=>s+a.value,0),1)*100:0}/><span className='muted' style={{fontSize:12}}>{(x.value/Math.max(lotGroups.reduce((s,a)=>s+a.value,0),1)*100).toFixed(1)}%</span></>}</td><td><button className='btn secondary' onClick={()=>{setLot(x.name);setBlock('All Blocks')}}>Open Lot</button></td></tr>)}</tbody></table></div>
  <div className='card' style={{marginTop:16,overflowX:'auto'}}><h3>Blocks — {lot}</h3><table className='table'><thead><tr><th>Block</th><th>Schemes</th><th>BOQ Items</th><th>Approved Qty</th><th>Approved Value</th><th>Value chart</th><th></th></tr></thead><tbody>{visibleBlocks.map(x=><tr key={x.name}><td><b>{x.name}</b></td><td>{x.schemes}</td><td>{x.items.toLocaleString('en-IN')}</td><td>{x.qty.toLocaleString('en-IN',{maximumFractionDigits:3})}</td><td><b>{money(x.value)}</b></td><td style={{minWidth:180}}><Bar pct={x.value/maxBlock*100}/></td><td><button className='btn secondary' onClick={()=>setBlock(x.name)}>Open Block</button></td></tr>)}</tbody></table></div>
  <div className='card' style={{marginTop:16}}><h3>Drill-down</h3><p className='muted'>Current scope: <b>{lot}</b> → <b>{block}</b>. Continue to the scheme register to inspect every scheme and its complete approved BOQ.</p><Link className='btn' href='/schemes'>Inspect schemes and items</Link></div>
 </div></Shell>;
}
