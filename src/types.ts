export type ArbitraryObject = Record<string, any>;

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

export type TraversalOpts = {
  traversalType?: TraversalType;
  maxNodeCount?: number;
  cycleHandling?: boolean;
  /** The maximum depth that must be traversed (inclusive). Root object has depth 0. */
  maxDepth?: number;
};

export type TraversalType = 'depth-first' | 'breadth-first';
