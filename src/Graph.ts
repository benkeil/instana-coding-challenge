import fs from 'fs';

export type Latency = number | 'NO SUCH TRACE';

export default class Graph {
  constructor(
    private edges: {
      [source: string]: {
        [node: string]: number;
      };
    } = {},
    private nodes: string[] = []
  ) {}

  static fromFile(path: string): Graph {
    const content = fs.readFileSync(path).toString();
    const graph = new Graph();
    content.split(',').forEach((edge) => {
      const [from, to, weight] = edge.split('');
      graph.addEdge(from, to, +weight);
    });
    return graph;
  }

  addVertex(name: string): void {
    if (!this.edges[name]) {
      this.nodes.push(name);
      this.edges[name] = {};
    }
  }

  addEdge(source: string, target: string, latency: number): void {
    this.addVertex(source);
    this.addVertex(target);
    this.edges[source][target] = latency;
  }

  averageLatency(path: string): Latency {
    const nodes = path.split('-');
    let latency = 0;
    let i = 0;
    while (latency >= 0 && i < nodes.length - 1) {
      const from = nodes[i];
      const to = nodes[i + 1];
      const edge = this.edges[from][to];
      if (edge) {
        latency += edge;
      } else {
        latency = -1;
      }
      i += 1;
    }
    return latency < 0 ? 'NO SUCH TRACE' : latency;
  }

  private static nodeWithMinDistance(distances: { [key: string]: number }, visited: Set<string>): string | null {
    let minDistance = Infinity;
    let minVertex = null;
    for (let node in distances) {
      let distance = distances[node];
      if (distance < minDistance && !visited.has(node)) {
        minDistance = distance;
        minVertex = node;
      }
    }
    return minVertex;
  }

  private dijkstra(source: string, target: string): number {
    let distances: { [key: string]: number } = {};
    let visited = new Set<string>();

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] === source) {
        distances[this.nodes[i]] = 0;
      } else {
        distances[this.nodes[i]] = Infinity;
      }
    }

    let currentNode = Graph.nodeWithMinDistance(distances, visited);

    while (currentNode !== null) {
      let distance = distances[currentNode];
      let neighbors = this.edges[currentNode];
      for (let neighbor in neighbors) {
        let newDistance = distance + neighbors[neighbor];
        if (distances[neighbor] > newDistance) {
          distances[neighbor] = newDistance;
        }
      }
      visited.add(currentNode);
      currentNode = Graph.nodeWithMinDistance(distances, visited);
    }

    return distances[target];
  }

  shortestTrace(source: string, target: string): number {
    return source === target ? this.shortestTraceToSelf(source) : this.dijkstra(source, target);
  }

  private shortestTraceToSelf(source: string): number {
    let shortestDistance = Infinity;
    const children = Object.keys(this.edges[source]);
    for (let child of children) {
      const currentDistance = this.shortestTrace(source, child) + this.shortestTrace(child, source);
      shortestDistance = Math.min(currentDistance, shortestDistance);
    }
    return shortestDistance;
  }

  private walkMax(source: string, target: string, hopsLeft: number, path: string[], first = true): number {
    const children = Object.keys(this.edges[source]);
    let count = 0;
    if (hopsLeft >= 0 && source === target && !first) {
      return 1;
    }
    if (hopsLeft === 0) {
      return 0;
    }
    hopsLeft -= 1;
    for (let child of children) {
      count += this.walkMax(child, target, hopsLeft, [...path, child], false);
    }
    return count;
  }

  private walkExact(source: string, target: string, hopsLeft: number, path: string[], first = true): number {
    const children = Object.keys(this.edges[source]);
    let count = 0;
    if (hopsLeft === 0 && source === target && !first) {
      return 1;
    }
    if (hopsLeft === 0) {
      return 0;
    }
    hopsLeft -= 1;
    for (let child of children) {
      count += this.walkExact(child, target, hopsLeft, [...path, child], false);
    }
    return count;
  }

  numberOfTraces(
    source: string,
    target: string,
    { maxHops, exactHops }: { maxHops?: number; exactHops?: number }
  ): number {
    if (maxHops) {
      return this.walkMax(source, target, maxHops!, [source]);
    } else {
      return this.walkExact(source, target, exactHops!, [source]);
    }
  }

  private walkMaxLatency(source: string, target: string, latencyLeft: number, path: string[], first = true): number {
    const children = Object.keys(this.edges[source]);
    let count = 0;
    if (latencyLeft >= 0 && source === target && !first) {
      count = +1;
    }
    if (latencyLeft <= 0) {
      return 0;
    }
    for (let child of children) {
      const newLatencyLeft = latencyLeft - this.edges[source][child];
      count += this.walkMaxLatency(child, target, newLatencyLeft, [...path, child], false);
    }
    return count;
  }

  numberOfUniqueTraces(source: string, target: string, maxLatency: number): number {
    return this.walkMaxLatency(source, target, maxLatency, [source]);
  }
}
