import {Query, QueryEntity} from "@datorama/akita";
import {EmployeeState, EmployeeStore} from "./employee.store";
import {combineLatest, from, Observable, of} from "rxjs";
import {Employee} from "../employee.model";
import {Injectable} from "@angular/core";
import {distinct, map} from "rxjs/operators";

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
  // selectAreEmployeesLoaded$ = this.select(state => {
  //   return state.areEmployeesLoaded;
  // });
  selectAreEmployeesLoading$ = this.selectLoading()

  selectFilteredEmployees$ = combineLatest(
    this.filtersChange$,
    this.selectAll(),
    this.getFilteredEmployees
  );

  private getFilteredEmployees(filter, employees): Employee[] {
    let firstFilter = filter.city!='' ? employees.filter(t => (t.city).toLowerCase() == (filter.city).toLowerCase()) : employees;
    let secondFilter = filter.department!='' ? firstFilter.filter(t => (t.department).toLowerCase() == (filter.department).toLowerCase()): firstFilter;
    let thirdFilter = filter.firstName !='' ? secondFilter.filter(t => (t.firstName).toLowerCase() == (filter.firstName).toLowerCase()) : secondFilter;
    let fourthFilter = filter.lastName !='' ? thirdFilter.filter(t => (t.lastName).toLowerCase() == (filter.lastName).toLowerCase()) : thirdFilter;

      return fourthFilter;
    }

  updatedCities$ = this.selectFilteredEmployees$.pipe(map(res => {
      const cities = res.map(r => r.city); // 1
      const distinctCities = [...new Set(cities)]; // 2
      return distinctCities
    }));

  updatedDepartments$ = this.selectFilteredEmployees$.pipe(map(res => {
      const departments = res.map(r => r.department); // 1
      const distinctDepartments = [...new Set(departments)]; // 2
      return distinctDepartments
  }));

  updatedIIDs$ = this.selectFilteredEmployees$.pipe(
    map(employees => employees.map(e => e.id)),
  );

  // getLoaded(): Observable<boolean>{
  //   return this.select(state => state.isLoaded)
  // }

  // //akita provide a Loading service
  // getLoading(): Observable<boolean>{
  //   return this.selectLoading();
  // }
}
