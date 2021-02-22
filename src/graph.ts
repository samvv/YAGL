
export interface Graph<V = string> {
  addEdge(a: V, b: V): void;
  deleteEdge(a: V, b: V): void;
  hasEdge(a: V, b: V): boolean;
  getIncoming(node: V): Iterable<V>;
  getOutgoing(node: V): Iterable<V>;
  getVertices(): Iterable<V>;
  getEdges(): Iterable<[V, V]>;
  readonly edgeCount: number;
  readonly nodeCount: number;
}

export interface LabeledGraph<V = string, L = string> {
  getIncoming(node: V): Iterable<[L, V]>;
  getOutgoing(node: V): Iterable<[L, V]>;
  getVertices(): Iterable<V>;
  getEdges(): Iterable<[V, V, L]>;
  readonly edgeCount: number;
  readonly nodeCount: number;
}

export interface AsyncGraph<V = string> {
  hasEdge(a: V, b: V): Promise<boolean>;
  getIncoming(node: V): AsyncIterable<V>;
  getOutgoing(node: V): AsyncIterable<V>;
  getVertices(): AsyncIterable<V>;
  getEdges(): AsyncIterable<[V, V]>;
  readonly edgeCount: Promise<number>;
  readonly nodeCount: Promise<number>;
}

export interface AsyncLabeledGraph<V = string, L = string> {
  getIncoming(node: V): AsyncIterable<Array<[L, V]>>;
  getOutgoing(node: V): AsyncIterable<Array<[L, V]>>;
  getVertices(): AsyncIterable<V>;
  getEdges(): AsyncIterable<[V, V, L]>;
  readonly edgeCount: Promise<number>;
  readonly nodeCount: Promise<number>;
}

/**
 * A graph for storing named nodes. It extensively makes use of unordered
 * JavaScript objects in order to efficiently query nodes, insert new ones and
 * delete existing ones.
 *
 * Much like a ES6 Map or Set, this graph type guarantees that insertion order
 * is preserved for vertices. For example, if you add node A after B,
 * `getVertices()` will always retun `['B', 'A']`.
 */
export class NullObjectGraph<V extends PropertyKey> implements Graph<V> {

  private nodes = new Set<V>();
  private targetNodes = Object.create(null);
  private sourceNodes = Object.create(null);

  public edgeCount = 0;
  public nodeCount = 0;

  constructor(iterable?: Iterable<[V, V]>) {
    if (iterable !== undefined) {
      for (const [v, w] of iterable) {
        this.addEdge(v, w);
      }
    }
  }

  public hasEdge(a: V, b: V) {
    const targetNodes = this.targetNodes[a];
    return targetNodes !== undefined
        && targetNodes.has(b);
  }

  public addEdge(source: V, target: V): void {

    let targetNodes = this.targetNodes[source];
    if (targetNodes === undefined) {
      this.targetNodes[source] = targetNodes = new Set();
    }
    let sourceNodes = this.sourceNodes[target];
    if (sourceNodes === undefined) {
      this.sourceNodes[target] = sourceNodes = new Set();
    }

    if (!targetNodes.has(target)) {
      targetNodes.add(target);
      this.edgeCount++;
    }

    sourceNodes.add(source);

    if (!this.nodes.has(source)) {
      this.nodes.add(source);
      this.nodeCount++;
    }
    if (!this.nodes.has(target)) {
      this.nodes.add(target);
      this.nodeCount++;
    }

  }

  public deleteEdge(a: V, b: V) {

    const targetNodes = this.targetNodes[a];
    if (targetNodes === undefined || !targetNodes.has(b)) {
      return;
    }

    const sourceNodes = this.sourceNodes[b];

    targetNodes.delete(b);
    sourceNodes.delete(a);

  }

  public getIncoming(node: V) {
    return this.sourceNodes[node] ?? [];
  }

  public getOutgoing(node: V) {
    return this.targetNodes[node] ?? [];
  }

  public getVertices() {
    return this.nodes;
  }

  public *getEdges(): Iterable<[V, V]> {
    for (const source of this.nodes) {
      for (const target of this.targetNodes[source]) {
        yield [source, target];
      }
    }
  }

}

export type StringGraph = NullObjectGraph<string>;
export const StringGraph = NullObjectGraph;

export type NumberGraph = NullObjectGraph<number>;
export const NumberGraph = NullObjectGraph;

