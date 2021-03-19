import {Query, QueryEntity} from "@datorama/akita";
import {EmployeeState, EmployeeStore} from "./employee.store";
import {combineLatest, Observable} from "rxjs";
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
  filtersChange$ = this.select(state => state.ui.filters);
  selectAreEmployeesLoaded$ = this.select(state => {
    return state.areEmployeesLoaded;
  });

  selectFilteredEmployees$ = combineLatest(
    this.filtersChange$,
    this.selectAll(),
    this.getFilteredEmployees
  );

  private getFilteredEmployees(filter, employees): Employee[] {
    let firstFilter = filter.city!='' ? employees.filter(t => t.city == filter.city) : employees;
    let secondFilter = filter.department!='' ? firstFilter.filter(t => t.department == filter.department): firstFilter;
    let thirdFilter = filter.firstName !='' ? secondFilter.filter(t => t.firstName == filter.firstName) : secondFilter;
    let fourthFilter = filter.lastName !='' ? thirdFilter.filter(t => t.lastName == filter.lastName) : thirdFilter;

      return fourthFilter;
    }

  // getLoaded(): Observable<boolean>{
  //   return this.select(state => state.isLoaded)
  // }

  // //akita provide a Loading service
  // getLoading(): Observable<boolean>{
  //   return this.selectLoading();
  // }
}
