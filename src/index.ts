import {tarjan} from "./algorithms/tarjan";
import { Graph } from "./graph";

export * from "./graph";

export * from "./algorithms/preorder";
export * from "./algorithms/hasCycle"
export * from "./algorithms/tarjan"

// Default algorithm to use when finding strongly connected components
export {
  tarjan as sccs,
  tarjanAsync as sccsAsync
} from "./algorithms/tarjan";

export function *toposort<V>(graph: Graph<V>) {
  for (const scc of tarjan(graph)) {
    for (const v of scc) {
      yield v;
    }
  }
}

