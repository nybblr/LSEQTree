import {
  Random,
  MersenneTwister19937,
  createEntropy as createSeed,
} from 'random-js';

const createPRNG = (seed = createSeed()) => {
  let random = new Random(
    MersenneTwister19937.seedWithArray(seed)
  );
  return () => random.real(0, 1);
};

const naive = () => Math.random();

export {
  naive,
  createPRNG,
  createSeed,
};
