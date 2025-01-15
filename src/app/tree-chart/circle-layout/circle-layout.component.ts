import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as jsondata from 'src/assets/data/flare-2.json'

@Component({
  selector: 'app-circle-layout',
  templateUrl: './circle-layout.component.html',
  styleUrls: ['./circle-layout.component.scss']
})
export class CircleLayoutComponent implements OnInit{
  title = 'tree-chart';
  private treeData :any//   private treeData :any= {
//     name: "flare",
//     img:'DSM.png',
//     children:[{
//       name:"computer1",
//       img:'DEM.png',
//       children:[{
//         name:"display11",
//         img:'decoy.png'
//       },{
//         name:"display12",
//         img:'Agent.png'
//       },{
//         name:"display13",
//         img:'Agent.png'
//       },{
//         name:"display14",
//         img:'Agent.png'
//       },{
//         name:"display15",
//         img:'Agent.png'
//       },{
//         name:"display16",
//         img:'Agent.png'
//       },{
//         name:"display17",
//         img:'Agent.png'
//       },{
//         name:"display18",
//         img:'Agent.png'
//       },{
//         name:"display19",
//         img:'Agent.png'
//       },{
//         name:"display20",
//         img:'Agent.png'
//       }]
//     },{
//       name:"computer2",
//       img:'DEM.png',
//       children:[{
//         name:"display21",
//         img:'decoy.png'
//       },{
//         name:"display22",
//         img:'Agent.png'
//       },{
//         name:"display23",
//         img:'Agent.png'
//       },{
//         name:"display24",
//         img:'Agent.png'
//       },{
//         name:"display25",
//         img:'Agent.png'
//       },{
//         name:"display26",
//         img:'Agent.png'
//       },{
//         name:"display27",
//         img:'Agent.png'
//       },{
//         name:"display28",
//         img:'Agent.png'
//       },{
//         name:"display29",
//         img:'Agent.png'
//       },{
//         name:"display30",
//         img:'Agent.png'
//       },{
//         name:"display31",
//         img:'Agent.png'
//       },{
//         name:"display32",
//         img:'Agent.png'
//       }]
//     }]
    
// };
  svg: any;
  margin = { top: 100, right: 30, bottom: 50, left: 130 };
  duration = 750;

  width: number=220
  height: number=3000;
  cx=928*0.5;
  cy=928*0.54;
  radius = Math.min(928) - 80;
  root: any;

  i = 0;
  treemap: any;
  ngOnInit(): void {
    this.treeData=jsondata;
    this.svg = d3
      .select('#d3noob')
      .append('svg')
      .attr('viewBox',`${-this.cx*1.8} ${-this.cy*2}  2000 3800`)
      .append('g')
      .attr(
        'transform',
        'translate(' + (this.margin.left) + ',' + this.margin.top + ')'
      );

    // declares a tree layout and assigns the size
    this.treemap = d3.cluster()
    .size([2 * Math.PI, this.radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    // Assigns parent, children, height, depth
    this.root = this.treemap(d3.hierarchy(this.treeData)
    .sort((a, b) => d3.ascending(a.data.name, b.data.name)));
// Append links.
    this.svg.append("g")
.attr("fill", "none")
.attr("stroke", "#555")
.attr("stroke-opacity", 0.4)
.attr("stroke-width", 1.5)
.selectAll()
.data(this.root.links())
.join("path")
.attr("d", d3.linkRadial()
    .angle((d:any) => d.x)
    .radius((d:any) => d.y));

// Append nodes.
    this.svg.append("g")
.selectAll()
.data(this.root.descendants()).join('image')
    .attr('xlink:href', (d: any) =>d.data.img ? 'assets/img/DSM.png' : d.data.children ? '/assets/img/folder.png' : '/assets/img/decoy.png') // Use the `img` property
    .attr('x', -15) // Center the image horizontally
    .attr('y',-15) // Center the image vertically
    .attr('width', 30) // Set image width
    .attr('height', 30)
.attr("transform", (d:any) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
.attr("fill", (d:any) => d.children ? "#555" : "#999")
.attr("r", 2.5);

// Append labels.
    this.svg.append("g")
.attr("stroke-linejoin", "round")
.attr("stroke-width", 3)
.selectAll()
.data(this.root.descendants())
.join("text")
.attr("transform", (d:any) => `rotate(${d.x * 180 / Math.PI - 90})${d.data.img ? `translate(${d.y-20},0)` : d.data.children ? `translate(${d.y-10},0)` : `translate(${d.y+20},0)`} rotate(${d.x >= Math.PI ? 180 : 0})`)
.attr("dy", "0.31em")
.attr("x", (d:any) => d.x < Math.PI === !d.children ? 6 : -6)
.attr("text-anchor", (d:any) => d.x < Math.PI === !d.children ? "start" : "end")
.attr("paint-order", "stroke")
// .attr("stroke", "white")
.attr("fill", "white")
.text((d:any) => d.data.name);

return this.svg.node();
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
    // Collapse after the second level
    this.root.children.forEach((d:any) => {
      this.collapse(d);
    });

    this.update(this.root);
  }
  update(source: any) {
    // Assigns the x and y position for the nodes
    const treeData = this.treemap(this.root);

    // Compute the new tree layout.
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach((d: any) => {
      d.y = d.depth * 400;
      d.x = d.x * 1.2;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    const node = this.svg.selectAll('g.node').data(nodes, (d: any) => {
      return d.id || (d.id = ++this.i);
    });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', (_: any, d: any) => this.click(d));

    // Add Circle for the nodes
    nodeEnter.append('image')
    .attr('xlink:href', (d: any) =>d.data.img ? 'assets/img/DSM.png' : d.data.children ? '/assets/img/folder.png' : '/assets/img/decoy.png') // Use the `img` property
    .attr('x', -15) // Center the image horizontally
    .attr('y',-15) // Center the image vertically
    .attr('width', 30) // Set image width
    .attr('height', 30)
    .append('title') // Add the tooltip
    .text((d: any) => d.data.name);
    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d:any) => {
        return d.children || d.data._children ? -13 : 13;
      })
      .attr('text-anchor', (d: any) => {
        return d.children || d.data._children ? 'end' : 'start';
      })
      .text((d:any) => {
        return d.data.name;
      }).style('fill','white');
    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + d.y + ',' + d.x + ')';
      });
      nodeUpdate.select('circle')
      .style('fill', (d: any) => d._children ? 'black' : 'lightsteelblue');
    // Update the node attributes and style
    nodeUpdate
      .select('circle.node')
      .attr('r', 10)
      .attr('class', (d:any)=> d._children?'node fill':'node')
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = this.svg.selectAll('path.link').data(links, (d: any) => {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal(o, o);
      })
      .style('fill', 'none')
      .style('stroke', 'gray')
      .style('stroke-width', '3px');

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        return this.diagonal(d, d.parent);
      });

    // Remove any exiting links
    const linkExit = link
      .exit()
      .transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  
  collapse(d: any) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach((d:any)=>this.collapse(d));
      d.children = null;
    }
  }

  click(d: any) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }

  diagonal(s: any, d: any) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

    return path;
  }
}
