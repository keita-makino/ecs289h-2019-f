export type Path = {
  airline: string;
  traces: Trace[];
  __typename: string;
};

export type Trace = {
  x: number;
  y: number;
  z: number;
  __typename: string;
};
