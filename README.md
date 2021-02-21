YAGL
====

[![Build Status](https://www.travis-ci.org/samvv/YAGL.svg?branch=master)](https://www.travis-ci.org/samvv/YAGL)

YAGL is Yet Another Graph Library&trade; for storing and manipulating mathematical
graphs. It can be used in a wide range of applications, from package managers
that need to find the correct dependencies to network analysis.

⚠ Some components haven't thoroughly been tested yet. You are invited to try
out this library and report any bugs in the [issue tracker][1].

[1]: https://github.com/samvv/YAGL/issues

### Features

 - **Fully typed graph algorithms** with support for adding your own
 - **Algorithms in this library can be paused** to only provide part of the
   result
 - **Generic graph interface** allowing you to define your own graph on which the
   algorithms will work
 - **Support for asynchronous iteration protocol**, allowing data to be fetched
   as the algorithm continues.

## Examples

### Sorting a dependency graph

The following is an example of a simple graph with vertices numbered from 1 to 4.

<img src="https://raw.githubusercontent.com/samvv/YAGL/master/example-graph-1.png" />

```ts
import Graph from "yagl/graph/directed"

const g = new Graph([[1, 2], [3, 2], [4, 1], [4, 3]]);
```

If we want to know which node goes before the next, we can use this library
to perform a _toplogical sort_, like so:

```ts
import "yagl/toposort" // make available .toposort()

const ordered = g.toposort();

console.log(ordered.next().value); // outputs 2

// the rest of the items will not get calculated
```

If you want to force calculating all elements upfront you can make use of the spread operator:

```ts
console.log([...toposort(g)]) // [2, 1, 3, 4];
```

### Using the asynchronus API

The following example demonstrates how to use the asynchronous version of the
library to count how many people in a database are connected to one another
either directly or indirectly:

```ts
import { AsyncGraph } from "yagl/async"

interface Person { /* ... */ }

class MyGraphFromDB implements AsyncGraph<Person> {

  getOutgoingEdges(person) {
    return db.findFriendsOfPerson(person.id);
  }

  // ...
}

async function printConnected(person) {
  const g = new MyGraphFromDB();
  for await (const scc of g.getSCCs()) {
    console.log(`${scc.length} persons are connected to one another.`);
  }
}
```

## Graph Types

| Path        | Edge check | Add edge | Remove edge | Incoming | Outgoing |
|-------------|------------|----------|-------------|----------|----------|
| Hash        | O(1)       | O(1)     | O(1)        | O(1)     | O(1)     |

To import a graph implementation, first specify if it should be directed and
then if it should be labeled. Finally, use the name of the implementation
converted in lowercase and underscores, like so:

```ts
import DirectedHashGraph from "yagl/graph/directed/hash"
```

| Name  | Undirected | Directed | Labeled | Directed and labeled |
|-------|------------|----------|---------|----------------------|
| Hash  | ✅         | ✅       |         | ✅                   | 

## Algorithms

The algorithms are written using ES6 generators, which means that they
**incrementally perform calculations on-demand**. This can be extremely useful
if you e.g. only need the first strongly connected component in a graph, or
only want to calculate the next task if the previous task has finished.

### graph.preorder(startNode?)

```ts
import "yagl/algorithm/preorder"
```

Performs a depth-first graph traversal starting at the given node.
The nodes are traversed in _pre-order_, meaning that first the node itself is
returned, and then its children are visited. Returns an
[Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 
that generates the next node that has been visited.

### graph.postorder(startNode?)

```ts
import "yagl/algorithm/postorder"
```

Performs a depth-first graph traversal starting at the given node.
The nodes are traversed in _post-order_, meaning that first the children are
visited, and then the node itself is returned. Returns an [Iterable][2] that
generates the next node that has been visited.

### graph.breadthFirst(startNode?)

```ts
import "yagl/algorithm/breadthFirst"
```

Performs a breadth-first graph traversal starting at the given node. 
Returns an [Iterable][2] that generates the next node that has been visited.  

### graph.getRootNodes()

```ts
import "yagl/algorithm/getRootNodes"
```

Finds all nodes in the graph that do not have an ancestor. Takes `O(|V|)` time.
Returns an [Iterable][2] that generates the next root in unspecified order.

### graph.getSCCs()

```ts
import "yagl/algorithm/getSCCs"
```

Finds all _strongly connected components_ in a graph by going through all
nodes and edges. Takes `O(|E| + |V|)` time. Returns an [Iterable][2] that
generates lists of nodes that are strongly connected to one another.

### graph.hasCycle()

```ts
import "yagl/algorithm/hasCycle"
```

Quickly detect whether a given graph has cycles. In the worst case, this method
takes `O(|E| + |V|)` time, but it might return faster if there is a cycle.

### graph.toposort()

```ts
import "yagl/algorithm/toposort"
```

Performs a _topological sort_ on the graph. Also takes `O(|E| +
|V|)` time. Throws an error if the graph contains one or more cycles. Returns
an [Iterable][2] that generates the next dependency in reverse order.

[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol

## License

Copyright 2019 Sam Vervaeck

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

