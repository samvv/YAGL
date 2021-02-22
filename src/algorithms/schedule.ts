
import { Graph, AsyncGraph } from "../graph";

function isEmpty(iterable: Iterable<any>): boolean {
  return iterable[Symbol.iterator]().next().done!;
}

async function isEmptyAsync(iterable: AsyncIterable<any>): Promise<boolean> {
  return (await iterable[Symbol.asyncIterator]().next()).done!;
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

export async function* scheduleAsync<V>(graph: AsyncGraph<V>): AsyncGenerator<V[]> {

  let group = [];

  for await (const v of graph.getVertices()) {
    if (await isEmptyAsync(graph.getOutgoing(v))) {
      group.push(v);
    }
  }

  let newGroup: V[] = [];

  while (group.length > 0) {
    yield group;
    for (const v of group) {
      for await (const w of graph.getIncoming(v)) {
        newGroup.push(w);
      }
    }
    group = newGroup;
    newGroup = [];
  }

}

