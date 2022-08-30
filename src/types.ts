
export interface Graph<V = string> {
  addVertex(v: V): void;
  addEdge(a: V, b: V): void;
  deleteEdge(a: V, b: V): void;
  hasEdge(a: V, b: V): boolean;
  getIncoming(node: V): Iterable<V>;
  getOutgoing(node: V): Iterable<V>;
  getVertices(): Iterable<V>;
  getEdges(): Iterable<[V, V]>;
  readonly edgeCount: number;
  readonly vertexCount: number;
}

export interface LabeledGraph<V = string, L = string> {
  getIncoming(node: V): Iterable<[L, V]>;
  getOutgoing(node: V): Iterable<[L, V]>;
  getVertices(): Iterable<V>;
  getEdges(): Iterable<[V, V, L]>;
  readonly edgeCount: number;
  readonly vertexCount: number;
}

export interface AsyncGraph<V = string> {
  hasEdge(a: V, b: V): Promise<boolean>;
  getIncoming(node: V): AsyncIterable<V>;
  getOutgoing(node: V): AsyncIterable<V>;
  getVertices(): AsyncIterable<V>;
  getEdges(): AsyncIterable<[V, V]>;
  readonly edgeCount: Promise<number>;
  readonly vertexCount: Promise<number>;
}

export interface AsyncLabeledGraph<V = string, L = string> {
  getIncoming(node: V): AsyncIterable<Array<[L, V]>>;
  getOutgoing(node: V): AsyncIterable<Array<[L, V]>>;
  getVertices(): AsyncIterable<V>;
  getEdges(): AsyncIterable<[V, V, L]>;
  readonly edgeCount: Promise<number>;
  readonly vertexCount: Promise<number>;
}

