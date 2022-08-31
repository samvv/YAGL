
import { Graph, AsyncGraph } from "../types";

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
    for (const w of graph.getTargetVertices(v)) {
      stack.push(w);
    }
  }
  return false;
}


export async function hasCycleAsync<V>(graph: AsyncGraph<V>): Promise<boolean> {
  const visited = new Set<V>();
  const backEdges = new Set<V>();
  const stack = [];
  const toVisit = graph.getVertices()[Symbol.asyncIterator]();
  for (;;) {
    let v: V;
    if (stack.length === 0) {
      const result = await toVisit.next();
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
    for await (const w of graph.getOutgoing(v)) {
      stack.push(w);
    }
  }
  return false;
}
