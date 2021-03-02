type ArbitraryObject = Record<string, any>;

export interface TraversalMeta {
  currentPath: string | null;
  visitedNodes: WeakSet<ArbitraryObject>;
  depth: number;
}

/**
 * parent and key are null when processing the root object
 */
export type TraversalCallbackContext = {
  parent: ArbitraryObject | null;
  key: string | null;
  value: any;
  meta: TraversalMeta;
};

export type TraversalCallback = (context: TraversalCallbackContext) => void;

/** Applies a given callback function to all properties of an object and its children objects */
export const traverse = (
  root: ArbitraryObject,
  callback: TraversalCallback
): void => {
  if (typeof root !== 'object' || root === null) {
    throw new Error('First argument must be an object');
  }

  const recursionMeta: TraversalMeta = {
    visitedNodes: new WeakSet(),
    currentPath: null,
    depth: 0,
  };

  callback({ parent: null, key: null, value: root, meta: recursionMeta });

  _traverse(root, callback, recursionMeta);
};

const _traverse = (
  object: ArbitraryObject,
  callback: TraversalCallback,
  meta: TraversalMeta
) => {
  if (meta.visitedNodes.has(object)) {
    return;
  }
  meta.visitedNodes.add(object);

  for (const key in object) {
    const value = object[key];
    const previousPath = meta.currentPath;
    const currentPath = !previousPath ? `${key}` : `${previousPath}.${key}`;

    const newMeta: TraversalMeta = {
      currentPath: currentPath,
      visitedNodes: meta.visitedNodes,
      depth: meta.depth + 1,
    };

    callback({ parent: object, key, value, meta: newMeta });

    if (typeof value === 'object' && value !== null) {
      _traverse(value, callback, newMeta);
    }
  }
};
