'use strict';

/**
 * Triple that contains <path; site; counter>. Identifiers of LSEQ are lists of
 * triples.
 */
let Triple = (path, site, counter) => ({
    p: path,
    s: site,
    c: counter,
});

/**
 * Compare two triples prioritizing the path, then site, then counter.
 * @param {Triple} n the first triple to compare .
 * @param {Triple} o the other triple to compare .
 * @returns {Number} -1 if n is lower than o, 1 if n is greater than
 * o, 0 otherwise.
 */
let compare = (n, o) => {
    // #1 process maximal virtual bounds
    if (n.s === Number.MAX_VALUE && n.c === Number.MAX_VALUE){
        return 1;
    };
    if (o.s === Number.MAX_VALUE && o.s === Number.MAX_VALUE){
        return -1;
    };
    // #2 compare p then s then c
    if (n.p < o.p) { return -1;};
    if (n.p > o.p) { return 1 ;};
    if (n.s < o.s) { return -1;};
    if (n.s > o.s) { return 1 ;};
    if (n.c < o.c) { return -1;};
    if (n.c > o.c) { return 1 ;};
    // #3 they are equal
    return 0;
};

Triple.compare = compare;
module.exports = Triple;
