import { isBoundTriple } from '../../lib/triple.js';

const [nodeWidth, nodeHeight] = [50, 100];

let drawTree = (canvas, tree) => {
  let { width, height } = canvas.getBoundingClientRect();

  const svg = d3.select(canvas);

  const data = d3.hierarchy(tree.root);
  const layout = d3.tree()
    .nodeSize([nodeWidth, nodeHeight]);

  const root = layout(data);

  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  root.each(({x, y}) => {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  });

  const g = svg.append('g')
      .attr('class', 'tree')
      .attr('transform', `translate(${
        nodeWidth / 2 - x0
      },${
        nodeHeight / 2 - y0
      })`);

  const link = g.append('g')
    .attr('class', 'links')
  .selectAll('path')
    .data(root.links())
    .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y));

  const node = g.append('g')
    .attr('class', 'nodes')
  .selectAll('g')
  .data(root.descendants())
  .join('g')
    .attr('class', ({data: {e, t = {}}}) =>
      `node site-${isBoundTriple(t) || !t.s ? 'reserved' : t.s}`
    )
    .attr('transform', d => `translate(${d.x},${d.y})`);

  node.append('circle')
      .attr('class', 'base')
  ;

  node.append('text')
      .attr('class', 'content')
      .text(({data: n}) => n.e || '')
  ;

  node.append('text')
      .attr('class', 'position')
      .text(({data: n}) =>
        n === tree.root ? '' : n.t.p
      )
  ;
};

export default drawTree;
