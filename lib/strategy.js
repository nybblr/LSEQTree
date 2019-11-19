import Identifier from './identifier.js';
import { naive as defaultRandom } from './random.js';

/**
 * Enumerate the available sub-allocation strategies. The signature of these
 * functions is f(Id, Id, N+, N+, N, N): Id.
 */
class Strategy {    
    /**
     * @param {Base} base The base used to create the new identifiers.
     * @param {Number} [boundary = 10] The value used as the default maximum
     * spacing between identifiers.
     * @param {Function} [random = defaultRandom] A function to generate (pseudo)random numbers
     */
    constructor (base, boundary = 10, random = defaultRandom) {
        this._base = base;
        this._boundary = boundary;
        this._random = random;
    };
    
    /**
     * Choose an identifier starting from previous bound and adding random
     * number.
     * @param {LSeqNode} p The previous identifier.
     * @param {LSeqNode} q The next identifier.
     * @param {Number} level The number of concatenation composing the new
     * identifier.
     * @param {Number} interval The interval between p and q.
     * @param {Object} s The source that creates the new identifier.
     * @param {Number} c The counter of that source.
     * @return {Identifier} The new allocated identifier.
     */
    bPlus (p, q, level, interval, s, c) {
        let copyP = p, copyQ = q,
            step = Math.min(this._boundary, interval), //#0 the min interval
            digit = 0n,
            value;
        
        // #1 copy the previous identifier
        for (let i = 0; i <= level; ++i) {
	    value = (p && p.t.p) || 0;
            digit = digit + BigInt(value);
            if (i !== level) {
                digit = digit << BigInt(this._base.getBitBase(i + 1));
            };
            p = (p && !p.isLeaf() && p.child()) || null;
        };
        // #2 create a digit for an identifier by adding a random value
        // #A Digit
        digit = digit + BigInt(Math.floor(this._random() * step + 1));
        // #B Source & counter
        return this._getSC(digit, copyP, copyQ, level, s, c);
    };


    
    /**
     * Choose an identifier starting from next bound and substract a random
     * number.
     * @param {LSeqNode} p The previous identifier.
     * @param {LSeqNode} q The next identifier.
     * @param {Number} level The number of concatenation composing the new
     * identifier.
     * @param {Number} interval The interval between p and q.
     * @param {Object} s The source that creates the new identifier.
     * @param {Number} c The counter of that source.
     */
    bMinus (p, q, level, interval, s, c) {
        let copyP = p, copyQ = q,
            step = Math.min(this._boundary, interval),// #0 process min interval
            digit = 0n,
            pIsGreater = false, commonRoot = true,
            prevValue, nextValue;
        
        // #1 copy next, if previous is greater, copy maxValue @ depth
        for (let i = 0; i <= level; ++i) {
            prevValue = (p && p.t.p) || 0;
            nextValue = (q && q.t.p) || 0;
            
            if (commonRoot && prevValue !== nextValue) {
                commonRoot = false;
                pIsGreater = prevValue > nextValue;
            };
            if (pIsGreater) {
                nextValue = Math.pow(2,this._base.getBitBase(i))-1;
            };
            digit = digit + BigInt(nextValue);
            if (i !== level) {
                digit = digit << BigInt(this._base.getBitBase(i+1));
            };

            q = (q && !q.isLeaf() && q.child()) || null;
            p = (p && !p.isLeaf() && p.child()) || null;
        };
        
        // #3 create a digit for an identifier by subing a random value
        // #A Digit
        digit = digit + BigInt(
          -Math.floor(this._random()*step) - (pIsGreater ? 0 : 1)
        );

        // #B Source & counter
        return this._getSC(digit, copyP, copyQ, level, s, c);
    };

    /**
     * Copies the appropriates source and counter from the adjacent identifiers
     * at the insertion position.
     * @param {Number} d The digit part of the new identifier.
     * @param {LSeqNode} p The previous identifier.
     * @param {LSeqNode} q the next identifier.
     * @param {Number} level The size of the new identifier.
     * @param {Object} s The local site identifier.
     * @param {Number} c The local monotonic counter.
     * @return {Identifier} The new allocated identifier.
     */
    _getSC (d, p, q, level, s, c) {
        let sources = [], counters = [],
            i = 0,
            sumBit = this._base.getSumBit(level),
            tempDigit, value;
        
        while (i <= level) {
            tempDigit = d;
            tempDigit = tempDigit >> BigInt(sumBit - this._base.getSumBit(i));
            value = Number(tempDigit % BigInt(Math.pow(2, this._base.getBitBase(i))));
            sources[i]=s;
            counters[i]=c;
            
            if (q && q.t.p === value) { sources[i]=q.t.s; counters[i]=q.t.c; };
            if (p && p.t.p === value) { sources[i]=p.t.s; counters[i]=p.t.c; };
            
            q = (q && !q.isLeaf() && q.child()) || null;
            p = (p && !p.isLeaf() && p.child()) || null;

            ++i;
        };
        
        return new Identifier(this._base, d, sources, counters);
    };
    
};

export default Strategy;
