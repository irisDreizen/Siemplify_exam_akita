import {Query, QueryEntity} from "@datorama/akita";
import {EmployeeState, EmployeeStore} from "./employee.store";
import {combineLatest, from, Observable, of, Subscription} from "rxjs";
import {Employee} from "../employee.model";
import {Injectable} from "@angular/core";
import {distinct, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class employeeQuery extends QueryEntity<EmployeeState>{
  constructor(private employeesStore: EmployeeStore) {
    super(employeesStore);
  }

 //Observe filter changes in store
  filtersChange$ = this.select(state => state.ui.filters);

  //Observe is the store loading
  selectAreEmployeesLoading$ = this.selectLoading();

  //When any observable emits a value, the combineLatest function emit the last emitted value from each
  //this way we keep our employee list in the view updated with the employees and filters in the store
  selectFilteredEmployees$ = combineLatest(
    this.filtersChange$,
    this.selectAll(),
    this.getFilteredEmployees
  );

  //This function receives all filters from filtersChange$ and employees from selectAll() function
  //it filter employees array and returns it to selectFilteredEmployees$
  private getFilteredEmployees(filter, employees): Employee[] {
    let firstFilter = filter.city!='' && filter.city!=undefined? employees.filter(t =>
      (t.city).toLowerCase() ===(filter.city).toLowerCase() ) : employees;
    let secondFilter = filter.department!='' && filter.department!=undefined ? firstFilter.filter(t =>
      (t.department).toLowerCase() === (filter.department).toLowerCase()): firstFilter;
    let thirdFilter = filter.firstName !='' && filter.firstName !=undefined ? secondFilter.filter(t =>
      (t.firstName).toLowerCase().startsWith((filter.firstName).toLowerCase())) : secondFilter;
    let fourthFilter = filter.lastName !='' && filter.lastName !=undefined ? thirdFilter.filter(t =>
      (t.lastName).toLowerCase().startsWith((filter.lastName).toLowerCase())) : thirdFilter;

      return fourthFilter;
    }

  //An observable of all updated cities in employees store
  //It is used to show the user a list of cities for filtering the table
  updatedCities$ = this.selectAll().pipe(map(res => {
      const cities = res.map(r => r.city); // 1
      const distinctCities = [...new Set(cities)]; // 2
      return distinctCities
    }));

  //An observable of all updated departments in employees store
  //It is used to show the user a list of departments for filtering the table
  updatedDepartments$ = this.selectAll().pipe(map(res => {
      const departments = res.map(r => r.department); // 1
      const distinctDepartments = [...new Set(departments)]; // 2
      return distinctDepartments
  }));

  //An observable of all updated userID's in employees store
  //It is used in edit component to validate is the userID that the user want to edit is already in use
  updatedIIDs$ = this.selectAll().pipe(
    map(employees => employees.map(e => e.userID)),
  );
}
