import { describe, it, expect } from 'vitest';
import { createEmptySave, createNewSave, decodeSave, encodeSave } from './saveCodec';

describe('Canonical save decoder', () => {
  it('decodes into a new object, drops unknown fields, and retains duplicate owned copies', () => {
    const input = { ...createNewSave(), scrap: 42, bestDistance: 123.5, extra: 'drop' };
    const result = decodeSave(input); expect(result.kind).toBe('recovered');
    if (result.kind === 'unsupported') throw new Error('wrong result');
    expect(result.data).not.toBe(input); expect(result.data.inventory).not.toBe(input.inventory);
    expect(result.data.scrap).toBe(42); expect(result.data.bestDistance).toBe(123.5); expect(result.data).not.toHaveProperty('extra');
    input.inventory.push('fuel_t1'); expect(result.data.inventory).toEqual(['engine_t1','fuel_t1']);
    const duplicates = decodeSave({ ...createEmptySave(), inventory: ['engine_t1','engine_t1'] });
    expect(duplicates.kind).toBe('current');
  });
  it.each([-1,0.5,Infinity,NaN,1e400,Number.MAX_SAFE_INTEGER + 1,'10',null])('repairs invalid currency %s without losing other valid progress', scrap => {
    const result = decodeSave({ ...createNewSave(), scrap, bestDistance: 12 });
    expect(result.kind).toBe('recovered'); if (result.kind === 'unsupported') throw new Error('wrong result');
    expect(result.data.scrap).toBe(0); expect(result.data.bestDistance).toBe(12); expect(result.data.inventory).toEqual(['engine_t1','fuel_t1']);
  });
  it.each([-1,Infinity,NaN,Number.MAX_SAFE_INTEGER + 1,'1'])('clears invalid distance %s', bestDistance => {
    const result = decodeSave({ ...createEmptySave(), bestDistance });
    expect(result.kind).toBe('recovered'); if (result.kind !== 'unsupported') expect(result.data.bestDistance).toBe(0);
  });
  it('salvages known inventory, moves wrong-family ownership once, and clears invalid slots', () => {
    const input = { ...createEmptySave(), inventory: ['engine_t1',42,null,'bad','engine_t1'],
      installedParts: { engine:'fuel_t2', fuel:'bad', cooling:42, tires:null, suspension:null, bogus:'engine_t3' } };
    const result = decodeSave(input); expect(result.kind).toBe('recovered'); if (result.kind === 'unsupported') throw new Error('wrong result');
    expect(result.data.inventory).toEqual(['engine_t1','engine_t1','fuel_t2']);
    expect(Object.values(result.data.installedParts)).toEqual([null,null,null,null,null]);
    expect(result.data.installedParts).not.toHaveProperty('bogus');
  });
  it('fills missing current-version fields without inventing starter items', () => {
    const result = decodeSave({ version:1, scrap:33 }); expect(result.kind).toBe('recovered');
    if (result.kind !== 'unsupported') { expect(result.data).toEqual({ ...createEmptySave(), scrap:33 }); }
  });
  it.each([null,[],42,'bad'])('recovers a non-object %s to empty ownership', input => {
    const result = decodeSave(input); expect(result.kind).toBe('recovered');
    if (result.kind !== 'unsupported') expect(result.data).toEqual(createEmptySave());
  });
  it.each([0,0.5,2,99999,-1,'1',undefined])('preserves unsupported version %s rather than pretending migration exists', version => {
    expect(decodeSave({ ...createNewSave(), version }).kind).toBe('unsupported');
  });
  it('accepts current v1 and rejects semantically invalid serialization rather than JSON null coercion', () => {
    expect(decodeSave(createNewSave()).kind).toBe('current');
    expect(() => encodeSave({ ...createNewSave(), scrap: Infinity })).toThrow('noncanonical');
    expect(() => encodeSave({ ...createNewSave(), installedParts: { ...createEmptySave().installedParts, engine:'fuel_t1' } })).toThrow('noncanonical');
  });
});
