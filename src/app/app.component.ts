import { Component, OnInit, AfterViewInit, Injector, ElementRef, Renderer2, Inject } from '@angular/core';

import { createCustomElement, NgElement, WithProperties } from '@angular/elements';
import { DOCUMENT } from '@angular/common';

import { HtmlDirective } from './html.directive';

import { RestService } from '@app/rest.service';
import { ComponentGeneratorService } from '@app/component-generator.service';

import { GraphComponent } from '@main/graph/graph.component';
import { DivComponent } from '@html/div/div.component';

import { componentMap } from '@interfaces/component-map';

declare global {
  interface HTMLElementTagNameMap {
    'zig-graph': NgElement & WithProperties<{ properties: { [key: string]: any } }>;
  }
}

interface InputInteraction {
  id: string;
  dom_type: string;
  attribute: string;
}

interface InputsInteraction {
  [index: number]: InputInteraction;
  length: number;
}

interface InputMapSingle extends InputInteraction {
  value: any;
}

interface InputMapType {
  [index: string]: InputMapSingle;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, AfterViewInit {
  // Need to get this from API
  title = 'zig';

  layoutData!: any;
  interactionData: any;

  graphElement: any;

  //STORE THIS SEPARATELY, need to be able to set and share externally with python
  //url use to get layout data from python
  private static readonly initialApiEndPoint: string = 'http://127.0.0.1:5000/api';

  constructor(
    private restService: RestService,
    private injector: Injector,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    //this.initializeApp();
    //this.getInitialData();
    this.initializeApp();
  }

  initializeApp(): void {
    this.restService.getJSON(AppComponent.initialApiEndPoint).subscribe((data) => {
      // use renderer to make custom html element

      this.layoutData = data['sections'];
      this.interactionData = data['interactions'];

      this.generateDom(this.layoutData, this.elementRef.nativeElement);
    });
  }

  generateDom(sectionData: any, parentDOM: any): void {
    for (let x in sectionData) {
      const type: string = sectionData[x]['dom_type'];
      const properties: { [key: string]: string } = sectionData[x]['data'];
      const children: any = sectionData[x]['child'];

      // create Element
      let ele = this.createElement(type);

      // set Attributes
      this.setAttributes(ele, properties, type);

      // generate child recursively
      this.generateDom(children, ele);

      // add to DOM
      this.renderer.appendChild(parentDOM, ele);
    }
  }

  createElement(domType: any) {
    //TODO: need to map this to an interface/map

    let elementType = domType;

    if (domType == 'graph' && this.graphElement === undefined && customElements.get('zig-graph') === undefined) {
      // CREATE COMPONENT
      //cconvert custom element from component
      this.graphElement = createCustomElement(GraphComponent, { injector: this.injector });

      elementType = 'zig-graph';
      customElements.define(elementType, this.graphElement);
    }

    // normal HTML
    return this.renderer.createElement(elementType);
  }

  setAttributes(element: any, attributes: any, type?: any) {
    if (type == 'graph') {
      // send to Component's IN
      element.properties = attributes;
    } else {
      // set html attribute manually
      for (let a in attributes) {
        if (a == 'content') {
          element.innerHTML = attributes[a];
        } else if (attributes[a] != null) {
          this.renderer.setAttribute(element, a, attributes[a]);
        }
      }
    }
  }
}
