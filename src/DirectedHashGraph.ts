
import type { Graph } from "./types";

class MultiMap<K, V> {

  private mapping = new Map<K, V[]>();

  public get(key: K): V[] {
    const elements = this.mapping.get(key);
    return elements === undefined ? [] : elements;
  }

  public add(key: K, value: V): void {
    let elements = this.mapping.get(key);
    if (elements === undefined) {
      elements = [];
      this.mapping.set(key, elements);
    }
    elements.push(value);
  }

  public has(key: K, value?: V): boolean {
    if (value === undefined) {
      return this.mapping.has(key);
    }
    const elements = this.mapping.get(key);
    if (elements === undefined) {
      return false;
    }
    return elements.indexOf(value) !== -1;
  }

  public keys(): Iterable<K> {
    return this.mapping.keys();
  }

  public *values(): Iterable<V> {
    for (const elements of this.mapping.values()) {
      yield* elements;
    }
  }

  public *[Symbol.iterator](): Iterable<[K, V]> {
    for (const [key, elements] of this.mapping) {
      for (const value of elements) {
        yield [key, value];
      }
    }
  }

  public delete(key: K, value?: V): number {
    const elements = this.mapping.get(key);
    if (elements === undefined) {
      return 0;
    }
    if (value === undefined) {
      this.mapping.delete(key);
      return elements.length;
    }
    const i = elements.indexOf(value);
    if (i !== -1) {
      elements.splice(i, 1);
      if (elements.length === 0) {
        this.mapping.delete(key);
      }
      return 1;
    }
    return 0;
  }

}

/**
 * A graph for connecting any kind of JavaScript object by making use of the
 * native `Map` and `Set` primitives.
 *
 * Much like a ES6 Map or Set, this graph type guarantees that insertion order
 * is preserved for vertices. For example, if you add node A after B,
 * `getVertices()` will always retun `['B', 'A']`.
 */
export class DirectedHashGraph<V> implements Graph<V> {

  private nodes = new Set<V>();
  private sourceToTarget = new MultiMap<V, V>();
  private targetToSource = new MultiMap<V, V>();

  public edgeCount = 0;

  public constructor(iterable?: Iterable<[V, V]>) {
    if (iterable !== undefined) {
      for (const [v, w] of iterable) {
        this.addEdge(v, w);
      }
    }
  }

  public get vertexCount(): number {
    return this.nodes.size;
  }

  public hasEdge(a: V, b: V) {
    return this.sourceToTarget.has(a, b);
  }

  public addEdge(source: V, target: V): void {

    this.sourceToTarget.add(source, target);
    this.targetToSource.add(target, source);

    this.edgeCount++;

    this.nodes.add(source);
    this.nodes.add(target);

  }

  public deleteEdge(a: V, b: V) {
    this.sourceToTarget.delete(a, b);
    this.targetToSource.delete(b, a);
    this.edgeCount--;
  }

  public deleteVertex(node: V): void {
    let count = 0;
    for (const source of this.sourceToTarget.get(node)) {
      this.targetToSource.delete(source, node);
    }
    count += this.sourceToTarget.delete(node);
    for (const target of this.targetToSource.get(node)) {
      this.sourceToTarget.delete(target, node);
    }
    count += this.targetToSource.delete(node);
    //for (const source of this.targetToSource.get(node)) {
    //  this.sourceToTarget.delete(source, node);
    //}
    //for (const target of this.sourceToTarget.get(node)) {
    //  this.targetToSource.delete(target, node);
    //}
    this.edgeCount -= count;
    this.nodes.delete(node);
  }

  public getSourceVertices(node: V): Iterable<V> {
    return this.targetToSource.get(node);
  }

  public getTargetVertices(node: V): Iterable<V> {
    return this.sourceToTarget.get(node);
  }

  public getVertices(): Iterable<V> {
    return this.nodes;
  }

  public addVertex(v: V): void {
    this.nodes.add(v);
  }

  public hasVertex(v: V): boolean {
    return this.nodes.has(v);
  }

  public *getEdges(): Iterable<[V, V]> {
    for (const source of this.nodes) {
      const targets = this.sourceToTarget.get(source);
      for (const target of targets) {
        yield [source, target];
      }
    }
  }

}

