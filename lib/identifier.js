const Triple = require('./triple.js');
const LSeqNode = require('./lseqnode.js');
const compare = require('./compare.js');

let pathAtLevel = (digit, bitLength, base, i) => {
  let mine = digit >> BigInt(bitLength - base.getSumBit(i));
  return Number(
    mine % BigInt(Math.pow(2, base.getBitBase(i)))
  );
};

/**
 * Unique and immutable identifier composed of digit, sources, counters.
 */
class Identifier {

    /**
     * @param {Base} base The base of identifiers.
     * @param {Number[]} digits The digit (position in dense space).
     * @param {Object[]} sites The list of sources.
     * @param {Number[]} counters The list of counters.
     */
    constructor (base, digits, sites = [], counters = []) {
        this._d = digits;
        this._s = sites;
        this._c = counters;

        this._base = base;
    };


    /**
     * Set the d,s,c values according to the node in argument
     * @param {LSeqNode} node The lseqnode containing the path in the tree
     * structure.
     * @return {Identifier} This identifier modified.
     */
    fromNode (node) {
        // #1 process the length of the path
        let length = 1, tempNode = node;

        while (!tempNode.isLeaf()) {
            ++length;
            tempNode = tempNode.child();
        };
        // #2 copy the values contained in the path
        let _d = 0n;

        for (let i = 0; i < length ; ++i) {
            // #1a copy the site id
            this._s.push(node.t.s);
            // #1b copy the counter
            this._c.push(node.t.c);
            // #1c copy the digit
            _d += BigInt(node.t.p);
            if (i !== length - 1) {
                _d <<= BigInt(this._base.getBitBase(i+1));
            };
            node = node.child();
        };

        this._d = _d;
        return this;
    };

    /**
     * Convert the identifier into a node without element.
     * @param {Object} e The element associated with the node.
     * @return {LSeqNode} An LSeqNode containing the element and the path
     * extracted from this identifier.
     */
    toNode (elem) {
        const dBitLength = this._base.getSumBit(this._c.length - 1);

        let resultPath = this._c.map((_, i) =>
            Triple(
              pathAtLevel(this._d, dBitLength, this._base, i),
              this._s[i],
              this._c[i]
            )
        );

        return new LSeqNode(resultPath, elem);
    };


    /**
     * Compare two identifiers.
     * @param {Identifier} o The other identifier.
     * @return {Integer} -1 if this is lower, 0 if they are equal, 1 if this is
     * greater.
     */
    compareTo (o) {
        let dBitLength = this._base.getSumBit(this._c.length - 1);
        let odBitLength = this._base.getSumBit(o._c.length - 1);

        let result = 0;
        let depth = Math.min(this._c.length, o._c.length);

        // #1 Compare the list of <d,s,c>
        for (let i = 0; i < depth; i++) {
            let sum = this._base.getSumBit(i);
            // #1a truncate mine
            let mine = this._d >> BigInt(dBitLength - sum);
            // #1b truncate other
            let other = o._d >> BigInt(odBitLength - sum);
            // #2 Compare triples
            result = compare(mine, other)
                  || compare(this._s[i], o._s[i])
                  || compare(this._c[i], o._c[i]);

            if (result !== 0) { break; }
        };

        // #3 compare list size
        return result || compare(this._c.length, o._c.length);
    };
};


module.exports = Identifier;
