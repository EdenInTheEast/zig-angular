import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHtml]',
})
export class HtmlDirective {

  constructor(el: ElementRef) {
       el.nativeElement.style.backgroundColor = 'yellow';
  }
}
