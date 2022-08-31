
import { Graph } from "./types";
import { tarjan } from "./algorithms/tarjan";

export * from "./types";

export * from "./DirectedHashGraph"
export * from "./LabeledDirectedHashGraph"

export * from "./algorithms/preorder";
export * from "./algorithms/hasCycle";
export * from "./algorithms/tarjan";

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

