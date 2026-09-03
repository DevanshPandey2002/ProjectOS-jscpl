export type BoqRow={lot:string;dprNo:string|number|null;block:string;schemeName:string;schemeId:string|null;itemCode:string;itemDescription:string;unit:string;rate:number|string|null;category:string|null;part:string|null;approvedQty:number};
import {BOQ_PACKED_0} from './boqPacked0';
import {BOQ_PACKED_1} from './boqPacked1';
import {BOQ_PACKED_2} from './boqPacked2';
import {BOQ_PACKED_3} from './boqPacked3';
const PAYLOAD=[BOQ_PACKED_0,BOQ_PACKED_1,BOQ_PACKED_2,BOQ_PACKED_3].join('');
function b64(s:string){const x=atob(s),b=new Uint8Array(x.length);for(let i=0;i<x.length;i++)b[i]=x.charCodeAt(i);return b}
export async function loadBoqData():Promise<BoqRow[]>{
 const text=await new Response(new Blob([b64(PAYLOAD)]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 const packed=JSON.parse(text) as Record<string,{v:any[];i:number[]}>;
 const fields=['lot','dprNo','block','schemeName','schemeId','itemCode','itemDescription','unit','rate','category','part','approvedQty'];
 const n=packed.lot.i.length;const out:BoqRow[]=[];
 for(let r=0;r<n;r++){const o:any={};for(const f of fields){const c=packed[f];o[f]=c.v[c.i[r]]}out.push(o as BoqRow)}
 if(out.length!==2116)throw new Error('BOQ payload row count mismatch: '+out.length);
 return out;
}
