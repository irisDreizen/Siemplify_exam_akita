import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../employee.model";
import {Observable} from "rxjs";
import {delay, tap} from "rxjs/operators";
import {EmployeeStore} from "./employee.store";


@Injectable({
  providedIn: 'root'
})
export class RestService {
   url: string ="http://localhost:3000/Employees";
   store: EmployeeStore;
   http: HttpClient;

  constructor(http: HttpClient, store: EmployeeStore) {
    this.http=http;
    this.store=store;
  }

  getEmployees(): Observable<Employee[]>{
    this.store.update({areEmployeesLoaded: false});
    return  this.http.get<Employee[]>(this.url).pipe(delay(2000),
      tap(employees => {
        this.store.loadEmployees(employees, true)
      })
    );

  }

  updateEmployee(id: string, employee: any): Observable<Employee>{ //we paa new employee without id property
    this.store.update({areEmployeesLoaded: false});
    return this.http.put<Employee>(this.url+'/'+id, employee).pipe(delay(2000),
      tap(result => {
        this.store.updateEmployee(id, employee, true)
      })
    )
  }

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

}
