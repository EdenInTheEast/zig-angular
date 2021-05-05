import { Injectable, ComponentFactoryResolver } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentGeneratorService {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  generateComponent(componentName: string) {
    //let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentName);

 
  }

}
