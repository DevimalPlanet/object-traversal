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
   * Default: 'depth-first'
   */
  traversalType?: TraversalType;

  /**
   * Traversal stops when the traversed node count reaches this value.
   *
   * Default: Number.Infinity
   */
  maxNodes?: number;

  /**
   * If set to `true`, prevents infinite loops by not re-visiting repeated nodes.
   *
   * Default: true
   */
  cycleHandling?: boolean;

  /**
   * The maximum depth that must be traversed.
   *
   * Root object has depth 0.
   *
   * Default: Number.Infinity
   */
  maxDepth?: number;

  /**
   * If true, traversal will stop as soon as the callback returns a truthy value.
   *
   * This is useful for search use cases, where you typically want to skip traversing the remaining nodes once the target is found.
   *
   * Default: false
   */
  haltOnTruthy?: boolean;

  /**
   * The string to be used as separator for the `meta.nodePath` segments.
   *
   * Set to null if you wish to turn off `meta.nodePath` to increase traversal speed.
   *
   * Default: '.'
   */
  pathSeparator?: string | null;
};

export type FullTraversalOpts = Required<TraversalOpts> & {
  disablePathTracking: boolean;
};

export type TraversalType = 'depth-first' | 'breadth-first';
