import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})

export class RestService {
  response$!: Observable<any>;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }


  constructor(private httpClient: HttpClient) { }


  getJSON(apiPoint: string, queryDict?: any): Observable<any> {
    //need to add error handler	  	
    return this.httpClient.get(apiPoint, {params: queryDict?queryDict:null}).pipe(retry(3));
  }


  putJSON(apiPoint: string, data: any): Observable<any> {
    //need to add error handler	  	
    this.response$ = this.httpClient.put(apiPoint, data, this.httpOptions).pipe(retry(3));
    return this.response$;
  }


  postJSON(apiPoint: string, data: any): Observable<any> {
    //need to add error handler	  	
    this.response$ = this.httpClient.post(apiPoint, data, this.httpOptions).pipe(retry(3));
    return this.response$;
  }

}
