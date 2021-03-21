import { Injectable, OnDestroy } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../employee.model";
import {Observable, Subscription} from "rxjs";
import {delay, tap} from "rxjs/operators";
import {EmployeeStore} from "./employee.store";


@Injectable({
  providedIn: 'root'
})
export class RestService implements OnDestroy{
   url: string ="http://localhost:3000/Employees";
   store: EmployeeStore;
   http: HttpClient;
  private updateSub: Subscription;

  constructor(http: HttpClient, store: EmployeeStore) {
    this.http=http;
    this.store=store;
  }

  //Getting list of employees by get request and setting this list to store
  getEmployees(): Observable<Employee[]>{
    return  this.http.get<Employee[]>(this.url).pipe(delay(2000),
      tap(employees => {
        this.store.loadEmployees(employees)
      })
    );
  }

 //Updating specific employee details in store
  updateEmployee(id: string, employee: any){
    this.store.setLoading(true); //setting the store to loading mode since we updating the list. it will back to false automatically after updating the store.
    this.updateSub = this.http.put<Employee>(this.url+'/'+id, employee).pipe(delay(2000),
      tap(result => {
        this.store.updateEmployee(id, employee)

        this.store.update({
          ui: {
            filters:{
              city: undefined,
              department: undefined,
              firstName: undefined,
              lastName: undefined
            }
          }
        });

      })
    ).subscribe(res => {})
  }

  //Updating the store with the new filters changed in user interface
  updateFilter(city: string, department: string, firstName: string, lastName: string ) {
    this.store.update({
      ui: {
        filters:{
          city: city,
          department: department,
          firstName: firstName,
          lastName: lastName
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.updateSub.unsubscribe();
  }

}
