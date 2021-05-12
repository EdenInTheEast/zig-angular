import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit,
  Injector,
  ElementRef,
  Renderer2,
  Inject,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { HtmlDirective } from './html.directive';

import { RestService } from '@app/rest.service';
import { ComponentGeneratorService } from '@app/component-generator.service';

import { DivComponent } from '@html/div/div.component';

import { componentMap } from '@interfaces/component-map';


interface InputInteraction {
	id :string;
	dom_type: string;
	attribute: string;
}

interface InputsInteraction {
  [index:number] : InputInteraction;
	length: number;
}	


interface InputMapSingle extends InputInteraction{
	value: any;
}	

interface InputMapType {
	[index:string]: InputMapSingle;
}	



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'zig';
  jsonData!: any;
  interactionData: any;

  factoryResolver: any;
  component: any;

  v: any;

  @ViewChild('zigTemplate', { read: ViewContainerRef }) zigTemplate!: ViewContainerRef;

  //STORE THIS SEPARATELY, need to be able to set and share externally with python
	//url use to get layout data from python
  private static readonly initialApiEndPoint: string = 'http://127.0.0.1:5000/api';

  constructor(
    private restService: RestService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeApp();
    //this.getInitialData();
  }

  initializeApp(): void {
    this.restService.getJSON(AppComponent.initialApiEndPoint).subscribe((data) => {
      // use renderer to make custom html element

      this.jsonData = data['sections'];
      this.interactionData = data['interactions'];

      this.renderDOM(this.jsonData);
      this.renderInteractions(this.interactionData);
    });
  }

  renderDOM(sectionData: any): void {
    for (let x in sectionData) {
      let type: string = sectionData[x]['dom_type'];
      let properties: { [key: string]: string } = sectionData[x]['data'];

      if (type != 'graph') {
        let ele = this.renderer.createElement(type);

        //set attributes
        for (let a in properties) {
          this.renderer.setAttribute(ele, a, properties[a]);
          if (a == 'content') {
            this.renderer.setAttribute(ele, 'innerHTML', properties[a]);
            ele.innerHTML = properties[a];
          }
        }

        this.renderer.appendChild(this.elementRef.nativeElement, ele);

        for (let c in sectionData[x]['child']) {
          //TODO: need to keep doing this recursively
          let type = sectionData[x]['child'][c]['dom_type'];
          let prop = sectionData[x]['child'][c]['data'];

          let child = this.renderer.createElement(type);

          for (let a in prop) {
            this.renderer.setAttribute(child, a, prop[a]);
            if (a == 'content') {
              this.renderer.setAttribute(child, 'innerHTML', prop[a]);
              child.innerHTML = prop[a];
            }
          }
          this.renderer.appendChild(ele, child);
        }
      }
    }
  }

  renderInteractions(interactionData: any): void {
    for (let interact in interactionData) {
      let apiUrl: string = interactionData[interact]['api_point']; 

			//NOTE: Map() will have issue with JSON.stringify
			var inputs: InputsInteraction = interactionData[interact]['input']; 
			
		  var inputMap: any = this.getInputMap(inputs);
			this.setEventListener(inputs, inputMap, apiUrl);

      for (let o in interactionData[interact]['output']) {
        //NOTE: AT THIS POINT, python backend is the one 
				//determining and recording the INPUT and OUPUT 
				//relationships

      }
    }
  }
	

	getInputMap(inputs:InputsInteraction): any {
    var inputMap: InputMapType = {};

    for(const [indx,input] of Object.entries<InputInteraction>(inputs)) {
				const inputElement = document.getElementById(input['id']) as HTMLElement;
				const inputValue = inputElement.getAttribute(input['attribute']);  

				// create input Map first
				// send all input values on each change
			  inputMap[indx] = {id: input['id'], dom_type: input['dom_type'], attribute: input['attribute'], value: inputValue};		 

				// TODO: need to handle Graph Object too
			}	
		return inputMap
  }		


  setEventListener(inputs:InputsInteraction, inputMap:any, apiUrl: string): void {

    for(const [k,i] of Object.entries<InputInteraction>(inputs)) {				
				let inputID = i['id'];
				let inputType = i['dom_type'];
			  let inputAttribute = i['attribute'];
        let inputObject = document.getElementById(inputID);

        //TODO:
        // - Input types with valueX
        // - mouse and key events
        // - other types' attributes
        // - JS elements' properties

        if (inputType == 'input' && inputAttribute=="value") {
          // this is only for input types' values
          this.renderer.listen(inputObject, 'change', (event) => {
            inputMap[k]["value"] = event.target.value;

						//TODO: need error handler
            this.restService
              .putJSON(apiUrl, inputMap)
              .subscribe((data) => {
								// THIS WILL RETURN OUTPUT CHANGE DATA
								for(let d in data){
                  this.updateChange(d, data[d]['attribute'], data[d]['data'], data[d]['dom_type']);
                }
              });
          });
        }
      }
	}


	updateChange(id:string, attribute:string, value:any, dom_type?:string) {
	  let element = <HTMLElement>document.getElementById(id);

		// for content type and html attribute
		attribute=="content"?element.innerHTML = value:element.setAttribute(attribute, value);

		// TODO: others
		// graph type
  }


  try(): void {
    this.v = new DivComponent(this.elementRef, this.renderer, this.document);
    //this.v.properties = properties;
  }

  getInitialData(): void {
    this.restService.getJSON(AppComponent.initialApiEndPoint).subscribe((data) => {
      // creates component instead of html element
      //  uses NgContainer
      this.jsonData = data['sections'];

      console.log(this.jsonData);

      for (let x in this.jsonData) {
        let type = this.jsonData[x]['dom_type'];
        let properties = this.jsonData[x]['data'];

        // get Factory for each component and use that to create the component
        this.factoryResolver = this.componentFactoryResolver.resolveComponentFactory(componentMap[type]);
        this.component = this.factoryResolver.create(this.injector);

        //let ele = this.component.location;
        //this.renderer.setAttribute(ele, 'appHtml', '');

        this.zigTemplate.insert(this.component.hostView);

        // store all components in a hashmap

        // auto pass all properties regardless of type
        this.component.instance.properties = properties;
      }
    });
  }

  renderComponent(): void {
    let resolver = this.componentFactoryResolver.resolveComponentFactory(componentMap['graph']);
    let componentFactory = this.zigTemplate.createComponent(resolver);
  }

  /*
  
  renderInteractions(): void {
    this.restService.getJSON(AppComponent.initialApiEndPoint).subscribe((data) => {
      this.jsonInteractions = data['interactions'];
      for (let x in this.jsonInteractions) {
        let interactionPoint = this.jsonInteractions[x]['api'];
	let inputElements = this.jsonInteractions[x]['in'];
        let outputElements = this.jsonInteractions[x]['out'];	

        for (let i in inputElements) {
	  let component_id = inputElements['id']; 
	  let component_attr = inputElements['property']; 
          let component = this.componentDict[component_id];
          
	  // this method?? how to set that attribute as input
	  // how to set attributes that are not defined?
	  // what about output?
	  // what about attributes that could be both output and input?
          this.restService.getJSON(interactionPoint).subscribe((data) => { component.instance[component_attr] = data; });


          // another method
	  // use document to get id
	  // set attribute to be async
	  // this.prop = this.restService.getJSON(interactionPoint).subscribe((data)
	  // OUTPUT: this.child.setAttribute("id", "{{prop | async}}");
	  // what about input?  

	  // from client-side: commonly value, inner html, or element-specific
	  // from server: value, and can be any attributes



        }				
	);
      }
    });
  }

*/
}
