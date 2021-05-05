// need better way to import all
import { GraphComponent } from "@main/graph/graph.component";
import { DivComponent } from "@html/div/div.component";


export const componentMap: { [key: string]: any  } = {
  graph: GraphComponent,
  div: DivComponent, 
};
