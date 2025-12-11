import { parserPolicy } from '../policy.helper';

describe('Policy helper', () => {
  it('should correct format policy without ids', () => {
    const rawPolicy1 = 'read::SYSTEM_USER';

    const { action, resource, resourceIds } = parserPolicy(rawPolicy1);
    expect(action).toBe('read');
    expect(resource).toBe('SYSTEM_USER');
    expect(resourceIds).toEqual([]);
  });

  it('should correct format policy with all ids', () => {
    const rawPolicy2 = 'read::SYSTEM_USER::all';
    const { action, resource, resourceIds } = parserPolicy(rawPolicy2);
    expect(action).toBe('read');
    expect(resource).toBe('SYSTEM_USER');
    expect(resourceIds).toEqual([]);
  });

  it('should correct format policy with * ids', () => {
    const rawPolicy3 = 'write::SYSTEM_POST::*';
    const { action, resource, resourceIds } = parserPolicy(rawPolicy3);
    expect(action).toBe('write');
    expect(resource).toBe('SYSTEM_POST');
    expect(resourceIds).toEqual([]);
  });

  it('should correct format policy with specific ids', () => {
    const rawPolicy3 = 'write::SYSTEM_POST::1,2,3';
    const { action, resource, resourceIds } = parserPolicy(rawPolicy3);
    expect(action).toBe('write');
    expect(resource).toBe('SYSTEM_POST');
    expect(resourceIds).toEqual([1, 2, 3]);
  });
});
