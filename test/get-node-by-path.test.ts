import { getNodeByPath } from '../src';

describe(`getNodeByPath`, () => {
  it('can get root node', () => {
    const root: any = {
      a: { b: 1 },
    };
    const path = '';

    const node: any = getNodeByPath(root, path);
    expect(node).toBe(root);
  });

  it('can get child node', () => {
    const root: any = {
      a: { b: 1 },
    };
    const path = 'a';

    const node: any = getNodeByPath(root, path);
    expect(node).toBe(root.a);
  });

  it('can get nested child node', () => {
    const root: any = {
      a: { b: 1 },
    };
    const path = 'a.b';

    const node: any = getNodeByPath(root, path);
    expect(node).toBe(root.a.b);
  });

  it('accepts custom separator', () => {
    const root: any = {
      a: { b: 1 },
    };
    const path = 'a,b';

    const node: any = getNodeByPath(root, path, ',');
    expect(node).toBe(root.a.b);
  });

  it('returns undefined for invalid paths', () => {
    const root: any = {
      a: { b: 1 },
    };
    const path = 'b.c';

    const node: any = getNodeByPath(root, path);
    expect(node).toBe(undefined);
  });
});
