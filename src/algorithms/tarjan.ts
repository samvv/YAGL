
import { GraphLike, AsyncGraphLike } from "../types"

interface TarjanVertexData {
  index?: number;
  lowlink?: number;
  onStack?: boolean;
}

export function* tarjan<V>(graph: GraphLike<V>): Generator<V[]> {

  const vertexData = new Map<V, TarjanVertexData>();

  let index = 0;
  const stack: V[] = [];

  for (const v of graph.getVertices()) {
    if (!vertexData.has(v)) {
      yield* strongconnect(v);
    }
  }

  function* strongconnect(v: V): Generator<V[]> {

    const vData = getData(v);
    vData.index = index;
    vData.lowlink = index;
    index++;
    stack.push(v);
    vData.onStack = true;

    for (const w of graph.getTargetVertices(v)) {
      const wData = getData(w);
      if (wData.index === undefined) {
        yield* strongconnect(w);
        vData.lowlink = Math.min(vData.lowlink, wData.lowlink!);
      } else if (wData.onStack) {
        vData.lowlink = Math.min(vData.lowlink, wData.index);
      }
    }

    if (vData.lowlink === vData.index) {
      const scc: V[] = [];
      for (;;) {
        const w = stack.pop()!;
        const wData = getData(w);
        wData.onStack = false;
        scc.push(w);
        if (w === v) {
          break;
        }
      }
      yield scc
    }

  }

  function getData(v: V): TarjanVertexData {
    const result = vertexData.get(v);
    if (result !== undefined) {
      return result;
    }
    const toInsert = {};
    vertexData.set(v, toInsert);
    return toInsert;
  }

}

export async function* tarjanAsync<V>(graph: AsyncGraphLike<V>): AsyncGenerator<V[]> {

  const vertexData = new Map<V, TarjanVertexData>();

  let index = 0;
  const stack: V[] = [];

  for await (const v of graph.getVertices()) {
    if (!vertexData.has(v)) {
      yield* strongconnect(v);
    }
  }

  async function* strongconnect(v: V): AsyncGenerator<V[]> {

    const vData = getData(v);
    vData.index = index;
    vData.lowlink = index;
    index++;
    stack.push(v);
    vData.onStack = true;

    for await (const w of graph.getTargetVertices(v)) {
      const wData = getData(w);
      if (wData.index === undefined) {
        yield* strongconnect(w);
        vData.lowlink = Math.min(vData.lowlink, wData.lowlink!);
      } else if (wData.onStack) {
        vData.lowlink = Math.min(vData.lowlink, wData.index);
      }
    }

    if (vData.lowlink === vData.index) {
      const scc: V[] = [];
      for (;;) {
        const w = stack.pop()!;
        const wData = getData(w);
        wData.onStack = false;
        scc.push(w);
        if (w === v) {
          break;
        }
      }
      yield scc
    }

  }

  function getData(v: V): TarjanVertexData {
    const result = vertexData.get(v);
    if (result !== undefined) {
      return result;
    }
    const toInsert = {};
    vertexData.set(v, toInsert);
    return toInsert;
  }

}

