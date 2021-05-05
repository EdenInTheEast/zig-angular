export interface primaryInterface {
  // properties should be an literal object that contain all the necessary information. will be a dict in python
  properties: { [key:string]:any } ;

}	


export interface mainCompInterface extends primaryInterface {

}

export interface htmlCompInterface extends primaryInterface {

}


