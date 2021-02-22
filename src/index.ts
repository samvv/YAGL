import {tarjan} from "./algorithms/tarjan";
import { Graph } from "./graph";

export * from "./graph";

export * from "./algorithms/preorder";
export * from "./algorithms/hasCycle";
export * from "./algorithms/tarjan";
export * from "./algorithms/schedule";

// Default algorithm to use when finding strongly connected components
export {
  tarjan as strongconnect,
  tarjanAsync as strongconnectAsync
} from "./algorithms/tarjan";

export function *toposort<V>(graph: Graph<V>) {
  for (const scc of tarjan(graph)) {
    for (const v of scc) {
      yield v;
    }
  }
}

