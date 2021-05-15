import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { mainCompInterface } from "@interfaces/component-interface" ;

declare var Plotly: any;


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit, mainCompInterface {
  graphId! :string;
  readonly max: number = 100000;
  @Input() properties!: { [key:string]:any } ;

  constructor() { 
     
 
  }

  ngOnInit(): void {
    if(!this.graphId) {
      this.generateGraphId();
    }
    
  }

  ngAfterViewInit() {
    this.createGraph(this.properties['data'],this.properties['layout'] );
  }

  // graphData should be an object literal
  createGraph(graphData:any, graphLayout:any) {
    Plotly.newPlot(this.graphId, graphData, graphLayout);
  }	  

  generateGraphId() {
    this.graphId = (Math.random() * this.max).toString();
  }
}
