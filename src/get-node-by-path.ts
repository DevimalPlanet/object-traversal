import { DEFAULT_SEPARATOR } from './constants';
import { ArbitraryObject } from './types';

export function getNodeByPath(
  root: ArbitraryObject,
  path: string,
  separator: string = DEFAULT_SEPARATOR
) {
  let node: any = root;
  const segments: string[] = path.split(separator);

  let index = 0;
  let segment = segments[index];
  while (node && segment) {
    node = node[segment];
    segment = segments[++index];
  }

  return node;
}
