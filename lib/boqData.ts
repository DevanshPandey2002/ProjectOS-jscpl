export type BoqRow = {lot:string;dprNo:string|number|null;block:string;schemeName:string;schemeId:string|null;itemCode:string;itemDescription:string;unit:string;rate:number|string|null;category:string|null;part:string|null;approvedQty:number};

const DATA_GZIP_BASE64 = '"+b64+"';

function base64ToBytes(value:string){
  const binary=atob(value); const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}

export async function loadBoqData():Promise<BoqRow[]>{
  const stream=new Blob([base64ToBytes(DATA_GZIP_BASE64)]).stream().pipeThrough(new DecompressionStream('gzip'));
  const text=await new Response(stream).text();
  return JSON.parse(text) as BoqRow[];
}
