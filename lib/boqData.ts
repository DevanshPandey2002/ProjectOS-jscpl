export type BoqRow = {lot:string;dprNo:string|number|null;block:string;schemeName:string;schemeId:string|null;itemCode:string;itemDescription:string;unit:string;rate:number|string|null;category:string|null;part:string|null;approvedQty:number};

import { BOQ_DATA_CHUNK_0 } from './boqDataChunk0';
import { BOQ_DATA_CHUNK_1 } from './boqDataChunk1';
import { BOQ_DATA_CHUNK_2 } from './boqDataChunk2';
import { BOQ_DATA_CHUNK_3 } from './boqDataChunk3';
import { BOQ_DATA_CHUNK_4 } from './boqDataChunk4';
import { BOQ_DATA_CHUNK_5 } from './boqDataChunk5';
import { BOQ_DATA_CHUNK_6 } from './boqDataChunk6';
import { BOQ_DATA_CHUNK_7 } from './boqDataChunk7';
import { BOQ_DATA_CHUNK_8 } from './boqDataChunk8';

const DATA_GZIP_BASE64 = [BOQ_DATA_CHUNK_0,BOQ_DATA_CHUNK_1,BOQ_DATA_CHUNK_2,BOQ_DATA_CHUNK_3,BOQ_DATA_CHUNK_4,BOQ_DATA_CHUNK_5,BOQ_DATA_CHUNK_6,BOQ_DATA_CHUNK_7,BOQ_DATA_CHUNK_8].join('');

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
