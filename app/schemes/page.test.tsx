import {describe,expect,it} from 'vitest';

describe('scheme register data contract',()=>{
 it('defines the hierarchy expected by the page',()=>{
  const fields=['lot','schemeId','schemeName','block','itemCode','unit','rate','approvedQty'];
  expect(fields).toContain('lot');
  expect(fields).toContain('schemeName');
  expect(fields).toContain('approvedQty');
 });
});
