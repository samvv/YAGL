
import { AsyncGraph, Graph } from "../types";

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
    for (const w of graph.getTargetVertices(v)) {
      stack.push(w);
    }
  }
}

export async function *preorderAsync<V>(graph: AsyncGraph<V>): AsyncGenerator<V> {
  const visited = new Set<V>();
  const stack = [];
  const toVisit = graph.getVertices()[Symbol.asyncIterator]();
  for (;;) {
    let v: V;
    if (stack.length === 0) {
      const result = await toVisit.next();
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
    for await (const w of graph.getOutgoing(v)) {
      stack.push(w);
    }
  }
}

