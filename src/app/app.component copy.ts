import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, Injector } from '@angular/core';

import { RestService } from './rest.service';
import { ComponentGeneratorService } from './component-generator.service';

import { componentMap } from "@interfaces/component-map";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})


export class AppComponent implements OnInit, AfterViewInit {
  title = 'zig';
  jsonData: any;
  factoryResolver: any;
  component: any; 

  @ViewChild("zigTemplate", {read:ViewContainerRef}) zigTemplate!: ViewContainerRef; 

  //STORE THIS SEPARATELY
  private static readonly initialApiEndPoint: string = "http://127.0.0.1:5000/api";


  constructor(private restService: RestService, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {}

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.getInitialData(); 
  }

  getInitialData(): void{
    this.restService.getJSON(AppComponent.initialApiEndPoint).subscribe(data => {
      this.jsonData=data;
	for (let x in this.jsonData) {
          let type = this.jsonData[x]['type']; 
	  let properties = this.jsonData[x]['data'];

	  
	  // get Factory for each component and use that to create the component
	  this.factoryResolver = this.componentFactoryResolver.resolveComponentFactory(componentMap[type]); 
	  this.component = this.factoryResolver.create(this.injector); 
	  this.zigTemplate.insert(this.component.hostView);

	  // auto pass all properties regardless of type
	  this.component.instance.properties = properties;
        }

    });
  } 

  renderComponent(): void {
        let resolver = this.componentFactoryResolver.resolveComponentFactory(componentMap["graph"]);
	let componentFactory = this.zigTemplate.createComponent(resolver); 
  }

}
