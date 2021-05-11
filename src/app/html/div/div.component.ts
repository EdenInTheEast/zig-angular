import { Component, Input, OnInit, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { htmlCompInterface } from "@interfaces/component-interface" ;
import { RestService } from '@app/rest.service';


@Component({
  selector: 'app-div',
  templateUrl: './div.component.html',
  styleUrls: ['./div.component.sass']
})

export class DivComponent implements OnInit, htmlCompInterface {

  @Input() properties!: object; 
  child: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document:any,  ) {
    this.child = document.createElement('div'); 
  }

  ngOnInit(): void {
    this.createDom(); 
  }

  
  createDom(): void {
    // test function	  
    this.child.innerHTML = "test me";
    this.child.setAttribute("id", "Baby");    

    const button = document.createElement('button');
    button.innerHTML = "click me";
    button.addEventListener("click", this.change);   

    this.renderer.appendChild(this.elementRef.nativeElement, this.child);
    this.renderer.appendChild(this.elementRef.nativeElement, button);
  }


  change(): void {
    document.getElementById("Baby")!.innerHTML = "change!";
  }	  



  subscribeIn(): void {


  }

  subscribeOut(): void {


  }


}
