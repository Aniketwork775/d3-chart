import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-vertical-layout',
  templateUrl: './vertical-layout.component.html',
  styleUrls: ['./vertical-layout.component.scss']
})
export class VerticalLayoutComponent implements OnInit{
  title = 'tree-chart';
  private treeData :any= {
    name: "flare",
    img:'DSM.png',
    children:[{
      name:"computer1",
      img:'DEM.png',
      children:[{
        name:"display11",
        img:'decoy.png'
      },{
        name:"display12",
        img:'Agent.png'
      },{
        name:"display13",
        img:'Agent.png'
      },{
        name:"display14",
        img:'Agent.png'
      },{
        name:"display15",
        img:'Agent.png'
      },{
        name:"display16",
        img:'Agent.png'
      },{
        name:"display17",
        img:'Agent.png'
      },{
        name:"display18",
        img:'Agent.png'
      },{
        name:"display19",
        img:'Agent.png'
      },{
        name:"display20",
        img:'Agent.png'
      }]
    },{
      name:"computer2",
      img:'DEM.png',
      children:[{
        name:"display21",
        img:'decoy.png'
      },{
        name:"display22",
        img:'Agent.png'
      },{
        name:"display23",
        img:'Agent.png'
      },{
        name:"display24",
        img:'Agent.png'
      },{
        name:"display25",
        img:'Agent.png'
      },{
        name:"display26",
        img:'Agent.png'
      },{
        name:"display27",
        img:'Agent.png'
      },{
        name:"display28",
        img:'Agent.png'
      },{
        name:"display29",
        img:'Agent.png'
      },{
        name:"display30",
        img:'Agent.png'
      },{
        name:"display31",
        img:'Agent.png'
      },{
        name:"display32",
        img:'Agent.png'
      }]
    }]
    
};
private rectW = 60;
private rectH = 30;
  svg: any;
  margin = { top: 100, right: 30, bottom: 50, left: 30 };
  duration = 750;

  width: number=20
  height: number=50;
  root: any;

  i = 0;
  treemap: any;
  ngOnInit(): void {
    this.svg = d3
      .select('#d3noob')
      .append('svg')
      .attr('viewBox','0 0 900 500')
      .append('g')
      .attr(
        'transform',
        'translate(' + (this.margin.left) + ',' + this.margin.top + ')'
      );

    // declares a tree layout and assigns the size
    this.treemap = d3.tree().size([this.width, this.height]);

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.treeData, (d: any) => {
      return d.children;
    });

    this.root.x0 = this.height / 2;
    this.root.y0 = 0;
    // Collapse after the second level
    this.root.children.forEach((d:any) => {
      this.collapse(d);
    });

    this.update(this.root);
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
  
  update(source: any) {
    // Assign the x and y position for the nodes
    const treeData = this.treemap(this.root);
  
    // Compute the new tree layout.
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);
  
    // Normalize for fixed-depth (y corresponds to depth now).
    const verticalSpacing = 180; // Increase vertical spacing
    const horizontalSpacing = 40; // Increase horizontal spacing factor
  
    nodes.forEach((d: any) => {
      d.x = d.x * horizontalSpacing; // Apply horizontal scaling
      d.y = d.depth * verticalSpacing; // Increase vertical spacing
    });
  
    // ****************** Nodes section ***************************
  
    // Update the nodes...
    const node = this.svg.selectAll('g.node').data(nodes, (d: any) => {
      return d.id || (d.id = ++this.i);
    });
  
    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => {
        return 'translate(' + source.x0 + ',' + source.y0 + ')';
      })
      .on('click', (_: any, d: any) => this.click(d));
  
    // Add rectangle for the nodes
    nodeEnter.append('rect')
      .attr('width', this.rectW)
      .attr('height', this.rectH)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .style('fill', (d: any) => d.data._children ?  'lightsteelblue' : '#fff');
  
    // Add labels for the nodes
    nodeEnter
      .append('text')
      .attr('x', this.rectW / 2)
      .attr('y', this.rectH / 2)
      .attr('dy', '.35em')
      .attr('font', '2px sans-serif')
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('cursor', 'pointer')
      .text((d: any) => d.data.name);
  
    // Update
    const nodeUpdate = nodeEnter.merge(node);
  
    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + d.x + ',' + d.y + ')';
      });

      
    nodeUpdate.select('rect')
    .style('fill', (d: any) => d._children ? 'lightsteelblue' : '#fff');
  
    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(this.duration)
      .attr('transform', (d: any) => {
        return 'translate(' + source.x + ',' + source.y + ')';
      })
      .remove();
  
    // On exit reduce the node rectangles' size to 0
    nodeExit.select('rect').attr('width', 0).attr('height', 0);
  
    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 1e-6);
  
    // ****************** Links section ***************************
  
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
      .style('stroke-width', '1px');
  
    // Update
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
  
  diagonal(s: any, d: any) {
    // Update path for top-to-bottom layout
    const path = `M${d.x+(this.rectW/2)},${d.y+this.rectH}
    C${((d.x + this.rectW + s.x) / 2)},${d.y}
     ${((d.x +this.rectW + s.x) / 2)},${s.y}
     ${s.x+(this.rectW/2)},${s.y}`;
    return path;
  }
}
