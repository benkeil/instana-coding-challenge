import Graph from './Graph';

const graph = Graph.fromFile('src/input.txt');

console.log('1.  ', graph.averageLatency('A-B-C'));
console.log('2.  ', graph.averageLatency('A-D'));
console.log('3.  ', graph.averageLatency('A-D-C'));
console.log('4.  ', graph.averageLatency('A-E-B-C-D'));
console.log('5.  ', graph.averageLatency('A-E-D'));
console.log('6.  ', graph.numberOfTraces('C', 'C', { maxHops: 3 }));
console.log('6.  ', graph.numberOfTraces('A', 'C', { exactHops: 4 }));
console.log('8.  ', graph.shortestTrace('A', 'C'));
console.log('9.  ', graph.shortestTrace('B', 'B'));
console.log('10. ', graph.numberOfUniqueTraces('C', 'C', 29));
