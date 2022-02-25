export type ArbitraryObject = Record<string, any>;

export interface TraversalMeta {
  nodePath?: string | null;
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

export type TraversalCallback = (context: TraversalCallbackContext) => any;

export type TraversalOpts = {
  /**
   * Default: depth-first'
   */
  traversalType?: TraversalType;
  /**
   * Traversal is stopped when number of traversed nodes reaches this value.
   *
   * Default: Number.Infinity
   */
  maxNodes?: number;
  /**
   * If true, traversal skip revisiting repeated nodes, also preventing possible infinite loops.
   *
   * Default: true
   */
  cycleHandling?: boolean;
  /**
   * The maximum depth that must be traversed (inclusive).
   *
   * Root object has depth 0.
   *
   * Default: Number.Infinity
   */
  maxDepth?: number;
  /**
   * Stop the traversal early if the callback returns a truthy value.
   *
   * This is useful for search use cases, where typically we want to skip traversing the remaining nodes once the target value has been found.
   *
   * Default: false
   */
  haltOnTruthy?: boolean;
  /**
   * The separator string to be used for meta.nodePath segments.
   *
   * Set to null if you wish to turn off nodePath tracking to maximize traversal speed.
   *
   * Default: '.'
   */
  pathSeparator?: string | null;
};

export type FullTraversalOpts = Required<TraversalOpts> & {
  disablePathTracking: boolean;
};

export type TraversalType = 'depth-first' | 'breadth-first';
