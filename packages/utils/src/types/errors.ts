export type TypeCheckingError<M extends string, G, E = unknown> = unknown extends E ? { error: M; got: G } : { error: M; got: G; expected: E }
