
import type { LabeledGraph } from "./types";

class MultiMap<K, V, L> {

  private mapping = new Map<K, [V, L][]>();

  public get(key: K): Iterable<[V, L]> {
    const elements = this.mapping.get(key);
    return elements === undefined ? [] : elements;
  }

  public add(key: K, value: V, label: L): void {
    let elements = this.mapping.get(key);
    if (elements === undefined) {
      elements = [];
      this.mapping.set(key, elements);
    }
    elements.push([value, label]);
  }

  public has(key: K, value?: V, label?: L): boolean {
    if (value === undefined && label === undefined) {
      return this.mapping.has(key);
    }
    const elements = this.mapping.get(key);
    if (elements === undefined) {
      return false;
    }
    for (const [otherValue, otherLabel] of elements) {
      if ((value === undefined || value === otherValue)
          && (label === undefined || label === otherLabel)) {
        return true;
      }
    }
    return false;
  }

  public keys(): Iterable<K> {
    return this.mapping.keys();
  }

  public *values(): Iterable<[V, L]> {
    for (const elements of this.mapping.values()) {
      yield* elements;
    }
  }

  public *[Symbol.iterator](): Iterable<[K, V, L]> {
    for (const [key, elements] of this.mapping) {
      for (const [value, label] of elements) {
        yield [key, value, label];
      }
    }
  }

  public delete(key: K, value?: V, label?: L): number {
    const elements = this.mapping.get(key);
    if (elements === undefined) {
      return 0;
    }
    for (let i = 0; i < elements.length; i++) {
      const [otherValue, otherLabel] = elements[i];
      if ((value === undefined || value === otherValue)
          && (label === undefined || label === otherLabel)) {
        elements.splice(i, 1);
        if (elements.length === 0) {
          this.mapping.delete(key);
        }
        return 1;
      }
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
export class LabeledDirectedHashGraph<V, L> implements LabeledGraph<V, L> {

  private nodes = new Set<V>();
  private sourceToTarget = new MultiMap<V, V, L>();
  private targetToSource = new MultiMap<V, V, L>();

  public edgeCount = 0;

  public constructor(iterable?: Iterable<[V, V, L]>) {
    if (iterable !== undefined) {
      for (const [v, w, l] of iterable) {
        this.addEdge(v, w, l);
      }
    }
  }

  public get vertexCount(): number {
    return this.nodes.size;
  }

  public hasEdge(a: V, b: V, label?: L) {
    return this.sourceToTarget.has(a, b, label);
  }

  public addEdge(source: V, target: V, label: L): void {

    this.sourceToTarget.add(source, target, label);
    this.targetToSource.add(target, source, label);

    this.edgeCount++;

    this.nodes.add(source);
    this.nodes.add(target);

  }

  public deleteEdge(a: V, b: V, label?: L): void { 
    const count = this.sourceToTarget.delete(a, b, label);
    this.targetToSource.delete(b, a, label);
    this.edgeCount -= count;
  }

  public deleteVertex(node: V): void {
    for (const [source, _] of this.targetToSource.get(node)) {
      this.sourceToTarget.delete(source, node);
    }
    this.targetToSource.delete(node);
    this.sourceToTarget.delete(node);
    this.nodes.delete(node);
  }

  public *getSourceVertices(node: V): Iterable<V> {
    for (const [source, _] of this.targetToSource.get(node)) {
      yield source;
    }
  }

  public *getTargetVertices(node: V): Iterable<V> {
    for (const [target, _] of this.sourceToTarget.get(node)) {
      yield target;
    }
  }
  
  public getIncomingEdges(node: V): Iterable<[V, L]> {
    return this.targetToSource.get(node);
  }

  public getOutgoingEdges(node: V): Iterable<[V, L]> {
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

  public *getEdges(): Iterable<[V, V, L]> {
    for (const source of this.nodes) {
      const targets = this.sourceToTarget.get(source);
      for (const [target, label] of targets) {
        yield [source, target, label];
      }
    }
  }

}

