import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as jsondata from 'src/assets/data/chaos.json';
import * as d3 from 'd3';

@Component({
  selector: 'app-tangle-chart',
  templateUrl: './tangle-chart.component.html',
  styleUrls: ['./tangle-chart.component.scss']
})
export class TangleChartComponent  implements AfterViewInit {
  data: any[] = jsondata;
  options: any = {};
  backgroundColor: string = '#ffffff';

  private svg: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.data || changes.options) {
  //     this.renderChart();
  //   }
  // }

  renderChart(): void {
    const element = this.el.nativeElement;
    d3.select(element).select('svg').remove(); // Clear previous chart

    const options = { color: (d: any, i: number) => d3.schemeCategory10[i], ...this.options };
    const layout = this.constructTangleLayout(JSON.parse(JSON.stringify(this.data)), options);


    // Create SVG
    this.svg = d3.select(element)
      .append('svg')
      .attr('width', layout.layout.width)
      .attr('height', layout.layout.height)
      .style('background-color', this.backgroundColor);

    // Add styles
    this.svg.append('style').text(`
      text {
        font-family: sans-serif;
        font-size: 10px;
      }
      .node {
        stroke-linecap: round;
      }
      .link {
        fill: none;
      }
    `);

    // Draw links
    layout.bundles.forEach((bundle, i) => {
      const d = bundle.links.map((link:any) => `
        M${link.xt} ${link.yt}
        L${link.xb - link.c1} ${link.yt}
        A${link.c1} ${link.c1} 90 0 1 ${link.xb} ${link.yt + link.c1}
        L${link.xb} ${link.ys - link.c2}
        A${link.c2} ${link.c2} 90 0 0 ${link.xb + link.c2} ${link.ys}
        L${link.xs} ${link.ys}
      `).join('');

      this.svg.append('path')
        .attr('class', 'link')
        .attr('d', d)
        .attr('stroke', this.backgroundColor)
        .attr('stroke-width', 5);

      this.svg.append('path')
        .attr('class', 'link')
        .attr('d', d)
        .attr('stroke', options.color(bundle, i))
        .attr('stroke-width', 2);
    });

    // Draw nodes
    layout.nodes.forEach((node:any) => {
      this.svg.append('path')
        .attr('class', 'node selectable')
        .attr('data-id', node.id)
        .attr('stroke', 'black')
        .attr('stroke-width', 8)
        .attr('d', `M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}`);

      this.svg.append('path')
        .attr('class', 'node')
        .attr('stroke', 'white')
        .attr('stroke-width', 4)
        .attr('d', `M${node.x} ${node.y - node.height / 2} L${node.x} ${node.y + node.height / 2}`);

      this.svg.append('text')
        .attr('class', 'selectable')
        .attr('data-id', node.id)
        .attr('x', node.x + 4)
        .attr('y', node.y - node.height / 2 - 4)
        .attr('stroke', this.backgroundColor)
        .attr('stroke-width', 2)
        .text(node.id);

      this.svg.append('text')
        .attr('x', node.x + 4)
        .attr('y', node.y - node.height / 2 - 4)
        .style('pointer-events', 'none')
        .text(node.id);
    });
  }

  constructTangleLayout(levels: any[], options: any) {
      // Precompute level depth
    levels.forEach((level, i) => 
      level.forEach((node: any) => (node.level = i))
    );

    const nodes = levels.flat();
    const nodesIndex: { [key: string]: any } = {};
    nodes.forEach((node) => (nodesIndex[node.id] = node));

    // Objectification
    nodes.forEach((node) => {
      node.parents = (node.parents ?? []).map((parentId: string) => nodesIndex[parentId]);
    });

    // Precompute bundles
    levels.forEach((level, i) => {
      const index: { [key: string]: any } = {};
      level.forEach((node: any) => {
        if (node.parents.length === 0) return;

        const id = node.parents.map((p: any) => p.id).sort().join('-X-');
        const minLevel:any = d3.min(node.parents, (p: any) => p.level) ?? 0;
// span: i - minLevel;

        if (index[id]) {
          index[id].parents = index[id].parents.concat(node.parents);
        } else {
          index[id] = {
            id,
            parents: [...node.parents],
            level: i,
            span: i - minLevel
          };
        }
        node.bundle = index[id];
      });

      level.bundles = Object.values(index);
      level.bundles.forEach((bundle: any, i: number) => (bundle.i = i));
    });

    const links: any[] = [];
    nodes.forEach((node) => {
      node.parents.forEach((parent: any) => {
        links.push({ source: node, bundle: node.bundle, target: parent });
      });
    });

    const bundles = levels.flatMap((level) => level.bundles);

    // Reverse pointer from parent to bundles
    bundles.forEach((bundle) => {
      bundle.parents.forEach((parent: any) => {
        parent.bundlesIndex = parent.bundlesIndex || {};
        parent.bundlesIndex[bundle.id] = parent.bundlesIndex[bundle.id] || [];
        parent.bundlesIndex[bundle.id].push(bundle);
      });
    });

    nodes.forEach((node) => {
      node.bundles = node.bundlesIndex
        ? Object.values(node.bundlesIndex)
        : [];
      node.bundles.sort((a: any, b: any) =>
        d3.descending(
          d3.max(a, (d: any) => d.span),
          d3.max(b, (d: any) => d.span)
        )
      );
      node.bundles.forEach((bundle: any, i: number) => (bundle.i = i));
    });

    links.forEach((link) => {
      if (!link.bundle.links) {
        link.bundle.links = [];
      }
      link.bundle.links.push(link);
    });

    // Layout settings
    const padding = 8;
    const nodeHeight = 22;
    const nodeWidth = 70;
    const bundleWidth = 14;
    const levelYPadding = 16;
    const metroD = 4;
    const minFamilyHeight = 22;

    options.c ??= 16;
    const c = options.c;
    options.bigc ??= nodeWidth + c;

    nodes.forEach((node) => {
      node.height = Math.max(1, node.bundles.length - 1) * metroD;
    });

    let xOffset = padding;
    let yOffset = padding;
    levels.forEach((level) => {
      xOffset += level.bundles.length * bundleWidth;
      yOffset += levelYPadding;
      level.forEach((node: any, i: number) => {
        node.x = node.level * nodeWidth + xOffset;
        node.y = nodeHeight + yOffset + node.height / 2;

        yOffset += nodeHeight + node.height;
      });
    });

    let i = 0;
    levels.forEach((level) => {
      level.bundles.forEach((bundle: any) => {
        bundle.x =
          d3.max(bundle.parents, (d: any) => d.x)! +
          nodeWidth +
          (level.bundles.length - 1 - bundle.i) * bundleWidth;
        bundle.y = i * nodeHeight;
      });
      i += level.length;
    });

    links.forEach((link) => {
      link.xt = link.target.x;
      link.yt =
        link.target.y +
        link.target.bundlesIndex[link.bundle.id].i * metroD -
        (link.target.bundles.length * metroD) / 2 +
        metroD / 2;
      link.xb = link.bundle.x;
      link.yb = link.bundle.y;
      link.xs = link.source.x;
      link.ys = link.source.y;
    });

    // Compress vertical space
    let yNegativeOffset = 0;
    levels.forEach((level) => {
      yNegativeOffset +=
        -minFamilyHeight +
          d3.min(level.bundles, (bundle: any) =>
            d3.min(bundle.links, (link: any) => link.ys - 2 * c - (link.yt + c))
          )! || 0;
      level.forEach((node: any) => (node.y -= yNegativeOffset));
    });

    links.forEach((link) => {
      link.yt =
        link.target.y +
        link.target.bundlesIndex[link.bundle.id].i * metroD -
        (link.target.bundles.length * metroD) / 2 +
        metroD / 2;
      link.ys = link.source.y;
      link.c1 =
        link.source.level - link.target.level > 1
          ? Math.min(options.bigc, link.xb - link.xt, link.yb - link.yt) - c
          : c;
      link.c2 = c;
    });

    const layout = {
      width: d3.max(nodes, (node: any) => node.x)! + nodeWidth + 2 * padding,
      height: d3.max(nodes, (node: any) => node.y)! + nodeHeight / 2 + 2 * padding,
      nodeHeight,
      nodeWidth,
      bundleWidth,
      levelYPadding,
      metroD
    };

    return { levels, nodes, nodesIndex, links, bundles, layout };
  }
}