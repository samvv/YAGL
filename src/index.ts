import {tarjan} from "./algorithms/tarjan";
import { Graph } from "./graph";

export * from "./graph";

// Default algorithm to use when finding strongly connected components
export { tarjan as sccs } from "./algorithms/tarjan";

export function *toposort<V>(graph: Graph<V>) {
  for (const scc of tarjan(graph)) {
    for (const v of scc) {
      yield v;
    }
  }
}

export function *preorder<V>(graph: Graph<V>): Generator<V> {
  const visited = new Set<V>();
  const stack = [];
  const toVisit = graph.getVertices()[Symbol.iterator]();
  for (;;) {
    let v: V;
    if (stack.length === 0) {
      const result = toVisit.next();
      if (result.done) {
        break;
      }
      v = result.value;
    } else {
      v = stack.pop()!;
    }
    if (visited.has(v)) {
      continue;
    }
    yield v;
    visited.add(v);
    for (const w of graph.getOutgoing(v)) {
      stack.push(w);
    }
  }
}


export function hasCycle<V>(graph: Graph<V>): boolean {
  const visited = new Set<V>();
  const backEdges = new Set<V>();
  const stack = [];
  const toVisit = graph.getVertices()[Symbol.iterator]();
  for (;;) {
    let v: V;
    if (stack.length === 0) {
      const result = toVisit.next();
      if (result.done) {
        break;
      }
      backEdges.clear();
      v = result.value;
    } else {
      v = stack.pop()!;
    }
    if (backEdges.has(v)) {
      return true;
    }
    if (visited.has(v)) {
      continue;
    }
    visited.add(v);
    backEdges.add(v);
    for (const w of graph.getOutgoing(v)) {
      stack.push(w);
    }
  }
  return false;
}

