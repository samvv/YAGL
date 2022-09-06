
export interface GraphLike<V> {
  getVertices(): Iterable<V>;
  getSourceVertices(node: V): Iterable<V>;
  getTargetVertices(node: V): Iterable<V>;
  readonly edgeCount: number;
  readonly vertexCount: number;
}

export interface Graph<V = string> extends GraphLike<V> {
  addEdge(a: V, b: V): void;
  addVertex(v: V): void;
  deleteEdge(a: V, b: V): void;
  getEdges(): Iterable<[V, V]>;
  hasEdge(a: V, b: V): boolean;
}

export interface LabeledGraph<V = string, L = string> extends GraphLike<V> {
  addEdge(a: V, b: V, label: L): void;
  addVertex(v: V): void;
  deleteEdge(a: V, b: V, label?: L): void;
  getEdges(): Iterable<[V, V, L]>;
  getIncomingEdges(node: V): Iterable<[V, L]>;
  getOutgoingEdges(node: V): Iterable<[V, L]>;
  hasEdge(a: V, b: V, label?: L): boolean;
}

export interface AsyncGraphLike<V> {
  getSourceVertices(node: V): AsyncIterable<V>;
  getTargetVertices(node: V): AsyncIterable<V>;
  getVertices(): AsyncIterable<V>;
  readonly edgeCount: Promise<number>;
  readonly vertexCount: Promise<number>;
}

export interface AsyncGraph<V = string> extends AsyncGraphLike<V> {
  addEdge(a: V, b: V): Promise<void>;
  addVertex(v: V): Promise<void>;
  deleteEdge(a: V, b: V): Promise<void>;
  getEdges(): AsyncIterable<[V, V]>;
  hasEdge(a: V, b: V): Promise<boolean>;
}

export interface AsyncLabeledGraph<V = string, L = string> extends AsyncGraphLike<V> {
  addEdge(a: V, b: V, label: L): Promise<void>;
  addVertex(v: V): Promise<void>;
  deleteEdge(a: V, b: V, label?: L): Promise<void>;
  getEdges(): AsyncIterable<[V, V, L]>;
  getIncomingEdges(node: V): AsyncIterable<Array<[V, L]>>;
  getOutgoingEdges(node: V): AsyncIterable<Array<[V, L]>>;
  hasEdge(a: V, b: V, label?: L): Promise<boolean>;
}

