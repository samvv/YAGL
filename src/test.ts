
import test from "ava";

import {
  HashGraph,
  strongconnect,
  toposort,
  hasCycle
} from "./index";

test('a HashGraph can have multiple edges to the same node', t => {
  const g = new HashGraph([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
    [1, 2],
  ]);
  t.assert(g.hasEdge(1, 2));
  g.deleteEdge(1, 2);
  t.assert(g.hasEdge(1, 2));
  g.deleteEdge(1, 2);
  t.assert(!g.hasEdge(1, 2));
  g.addEdge(1, 2);
  t.assert(g.hasEdge(1, 2));
  g.addEdge(1, 2);
  t.assert(g.hasEdge(1, 2));
  g.deleteEdge(1, 2);
  t.assert(g.hasEdge(1, 2));
  g.deleteEdge(1, 2);
  t.assert(!g.hasEdge(1, 2));
});

test('a HashGraph keeps track of all vertices being added through edges', t => {
  const g = new HashGraph();
  t.assert([...g.getVertices()].length === 0);
  g.addEdge(1, 2);
  const vs1 = new Set(g.getVertices());
  t.assert(vs1.has(1));
  t.assert(vs1.has(2));
  t.assert(vs1.size === 2);
});

test('a HashGraph keeps track of vertices that are directly being added', t => {
  const g = new HashGraph();
  t.assert([...g.getVertices()].length === 0);
  g.addVertex(1);
  const vs1 = new Set(g.getVertices());
  t.assert(vs1.has(1));
  t.assert(vs1.size === 1);
  g.addVertex(2);
  const vs2 = new Set(g.getVertices());
  t.assert(vs2.has(1));
  t.assert(vs2.has(2));
  t.assert(vs2.size === 2);
  g.addVertex(3);
  const vs3 = new Set(g.getVertices());
  t.assert(vs3.has(1));
  t.assert(vs3.has(2));
  t.assert(vs3.has(3));
  t.assert(vs3.size === 3);
});

test('a HashGraph removes all edges that are associated with a given node', t => {
  const g = new HashGraph([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 1],
    [1, 2],
  ]);
  g.deleteVertex(2);
  t.assert(!g.hasEdge(1, 2));
  t.assert(!g.hasEdge(2, 3));
  t.assert(!g.hasVertex(2));
});

test("toposort() works on the README example", t => {

  const g = new HashGraph([
    [1, 2], [3, 2], [4, 1], [4, 3]
  ]);

  const sorted = [...toposort(g)];
  t.assert(sorted[0] === 2);
  t.assert(sorted[1] === 1);
  t.assert(sorted[2] === 3);
  t.assert(sorted[3] === 4);

});

test("strongconnect() works on a graph with one small cycle", t => {

  const g = new HashGraph([
    [1, 2], [3, 2], [4, 1], [4, 3], [5, 4], [4, 5]
  ]);

  const sorted = [...strongconnect(g)];

  for (const scc of sorted) {
    scc.sort();
  }

  t.assert(sorted.length === 4);
  t.assert(sorted[0][0] === 2);
  t.assert(sorted[1][0] === 1);
  t.assert(sorted[2][0] === 3);
  t.assert(sorted[3][0] === 4);
  t.assert(sorted[3][1] === 5);

});

test("hasCycle() correctly reports cycles", t => {

  t.assert(hasCycle(new HashGraph([ [1, 2], [3, 2], [4, 1], [4, 3] ])) === false);

  t.assert(hasCycle(new HashGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 4], [4, 5] ])) === true);

  t.assert(hasCycle(new HashGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7] ])) === false);

  t.assert(hasCycle(new HashGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7], [7, 8] ])) === true);

  t.assert(hasCycle(new HashGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7], [7, 1] ])) === false);

});

