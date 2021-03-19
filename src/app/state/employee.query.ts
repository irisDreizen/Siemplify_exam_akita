import {Query, QueryEntity} from "@datorama/akita";
import {EmployeeState, EmployeeStore} from "./employee.store";
import {Observable} from "rxjs";
import {Employee} from "../employee.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class employeeQuery extends QueryEntity<EmployeeState>{
  constructor(private employeesStore: EmployeeStore) { // This EmployeeStore represent token - not the same as the store in class
    super(employeesStore);
  }

  // getEmployees() : Observable<Employee[]>{
  //   return this.select(state => state.employees)
  // }

  selectAreEmployeesLoaded$ = this.select(state => {
    return state.areEmployeesLoaded;
  });
  // getLoaded(): Observable<boolean>{
  //   return this.select(state => state.isLoaded)
  // }

  // //akita provide a Loading service
  // getLoading(): Observable<boolean>{
  //   return this.selectLoading();
  // }
}
