
import { Graph } from "../graph";

function isEmpty(iterable: Iterable<any>): boolean {
  return iterable[Symbol.iterator]().next().done!;
}

export function* schedule<V>(graph: Graph<V>): Generator<V[]> {

  let group = [];

  for (const v of graph.getVertices()) {
    if (isEmpty(graph.getOutgoing(v))) {
      group.push(v);
    }
  }

  let newGroup: V[] = [];

  while (group.length > 0) {
    yield group;
    for (const v of group) {
      for (const w of graph.getIncoming(v)) {
        newGroup.push(w);
      }
    }
    group = newGroup;
    newGroup = [];
  }

}

