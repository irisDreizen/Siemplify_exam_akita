import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {employeeQuery} from "../state/employee.query";
import {Observable, Subscription} from "rxjs";
import {EmployeeService} from "../state/employee.service";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {
  filters: FormGroup;
  departmentNames$: Observable<string[]> = this.employeesQuery.updatedDepartments$;
  citiesNames$: Observable<string []>  = this.employeesQuery.updatedCities$;
  filterChangingSubscription: Subscription;
  queryFilterChanging: Subscription;

  constructor(private employeesQuery: employeeQuery, private rs: EmployeeService) { }

  ngOnInit(): void {
    this.filters = new FormGroup({
      department: new FormControl(""),
      city: new FormControl(""),
      firstName: new FormControl(""),
      lastName: new FormControl("")
    });

    //updating the service if filter changed
    this.filterChangingSubscription = this.filters.valueChanges.subscribe(res => {
      this.rs.updateFilter(this.filters.value.city, this.filters.value.department, this.filters.value.firstName, this.filters.value.lastName)
    });

    // this subscription used for the edge case of user who filters the data and while the data filtered, he edit an employee
    // in this case, after editing the employee, the service will update the store with the new employee details
    // and in addition, it will update all the filters to undefined
    // so editing employee will cause filter's reset
    this.queryFilterChanging = this.employeesQuery.filtersChange$.subscribe(res => {
      if(res.firstName===undefined && res.lastName===undefined && res.department===undefined && res.city===undefined){
        this.reset();
      }
    });

  }

  reset() {
    // reset the current state to the initial value
    this.filters.reset({
      department:'',
      city:'',
      firstName:'',
      lastName:''
    })
  }

  //Destroying subscription when leaving the component
  ngOnDestroy(): void {
    this.filterChangingSubscription.unsubscribe()
    this.queryFilterChanging.unsubscribe()
  }




}
