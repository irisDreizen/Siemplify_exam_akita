import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {employeeQuery} from "../state/employee.query";
import {Observable, Subscription} from "rxjs";
import {RestService} from "../state/rest.service";

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

  constructor(private employeesQuery: employeeQuery, private rs: RestService) { }

  ngOnInit(): void {
    this.filters = new FormGroup({
      department: new FormControl(""),
      city: new FormControl(""),
      firstName: new FormControl(""),
      lastName: new FormControl("")
    });

    this.filterChangingSubscription = this.filters.valueChanges.subscribe(res => {
      this.rs.updateFilter(this.filters.value.city, this.filters.value.department, this.filters.value.firstName, this.filters.value.lastName)
    })
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
  }




}
