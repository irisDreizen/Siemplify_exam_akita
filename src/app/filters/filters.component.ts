import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {PersistNgFormPlugin} from "@datorama/akita";
import {employeeQuery} from "../state/employee.query";
import {Observable} from "rxjs";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit {
  filters: FormGroup;
  persistForm: PersistNgFormPlugin;
  departmentNames$: Observable<string[]> = this.employeesQuery.updatedDepartments$;
  citiesNames$: Observable<string []>  = this.employeesQuery.updatedCities$;


  constructor(private employeesQuery: employeeQuery) { }

  ngOnInit(): void {
    this.filters = new FormGroup({
      department: new FormControl(),
      city: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl()
    });
    this.persistForm = new PersistNgFormPlugin(this.employeesQuery, 'ui.filters')
      .setForm(this.filters);
  }



  reset() {
    // reset the current state to the initial value
    this.persistForm.reset();
  }



}
