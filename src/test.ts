
import test from "ava";

import {
  NumberGraph,
  sccs,
  toposort,
  hasCycle
} from "./index";

test("toposort() works on the README example", t => {

  const g = new NumberGraph([
    [1, 2], [3, 2], [4, 1], [4, 3]
  ]);

  const sorted = [...toposort(g)];
  t.assert(sorted[0] === 2);
  t.assert(sorted[1] === 1);
  t.assert(sorted[2] === 3);
  t.assert(sorted[3] === 4);

});

test("tarjan's algorithm works on a graph with one small cycle", t => {

  const g = new NumberGraph([
    [1, 2], [3, 2], [4, 1], [4, 3], [5, 4], [4, 5]
  ]);

  const sorted = [...sccs(g)];

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

  t.assert(hasCycle(new NumberGraph([ [1, 2], [3, 2], [4, 1], [4, 3] ])) === false);

  t.assert(hasCycle(new NumberGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 4], [4, 5] ])) === true);

  t.assert(hasCycle(new NumberGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7] ])) === false);

  t.assert(hasCycle(new NumberGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7], [7, 8] ])) === true);

  t.assert(hasCycle(new NumberGraph([ [1, 2], [3, 2], [4, 1], [4, 3], [5, 6], [7, 6], [8, 5], [8, 7], [7, 1] ])) === false);

});
