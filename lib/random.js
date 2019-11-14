const {
  Random,
  MersenneTwister19937,
  createEntropy: createSeed,
} = require('random-js');

const createPRNG = (seed = createSeed()) => {
  let random = new Random(
    MersenneTwister19937.seedWithArray(seed)
  );
  return () => random.real(0, 1);
};

const naive = () => Math.random();

module.exports = {
  naive,
  createPRNG,
  createSeed,
};
