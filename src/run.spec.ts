import Graph, { Latency } from './Graph';

type AverageTestCase = {
  trace: string;
  value: Latency;
};

type ShortestTraceTestCase = {
  from: string;
  to: string;
  value: Latency;
};

type NumberOfTracesTestCase = {
  from: string;
  to: string;
  config: { maxHops?: number; exactHops?: number };
  value: Latency;
};

type NumberOfUniqueTracesTestCase = {
  from: string;
  to: string;
  maxLatency: number;
  value: Latency;
};

describe('run', () => {
  const graph = Graph.fromFile('src/input.txt');

  describe('averageLatency', () => {
    test.each<AverageTestCase>([
      { trace: 'A-B-C', value: 9 },
      { trace: 'A-D', value: 5 },
      { trace: 'A-D-C', value: 13 },
      { trace: 'A-E-B-C-D', value: 22 },
      { trace: 'A-E-D', value: 'NO SUCH TRACE' },
    ])('avg($trace) = $value', ({ trace, value }) => {
      expect(graph.averageLatency(trace)).toBe(value);
    });
  });

  describe('shortestTrace', () => {
    test.each<ShortestTraceTestCase>([
      { from: 'A', to: 'C', value: 9 },
      { from: 'B', to: 'B', value: 9 },
    ])('shortestTrace($from, $to) = $value', ({ from, to, value }) => {
      expect(graph.shortestTrace(from, to)).toBe(value);
    });
  });

  describe('numberOfTraces', () => {
    test.each<NumberOfTracesTestCase>([
      { from: 'C', to: 'C', config: { maxHops: 3 }, value: 2 },
      { from: 'A', to: 'C', config: { exactHops: 4 }, value: 3 },
    ])('numberOfTraces($from, $to) = $value', ({ from, to, config, value }) => {
      expect(graph.numberOfTraces(from, to, config)).toBe(value);
    });
  });

  describe('numberOfUniqueTraces', () => {
    test.each<NumberOfUniqueTracesTestCase>([{ from: 'C', to: 'C', maxLatency: 29, value: 7 }])(
      'numberOfUniqueTraces($from, $to) = $value',
      ({ from, to, maxLatency, value }) => {
        expect(graph.numberOfUniqueTraces(from, to, maxLatency)).toBe(value);
      }
    );
  });
});
