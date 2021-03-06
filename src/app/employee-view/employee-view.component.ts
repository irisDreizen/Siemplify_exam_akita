import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {EmployeeService} from "../state/employee.service";
import {Employee} from "../employee.model";
import {Router} from "@angular/router";
import {employeeQuery} from "../state/employee.query";
import {filter, switchMap, take} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditEmployeeComponent} from "../edit-employee/edit-employee.component";
import {Observable, Subscription} from "rxjs";


@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeViewComponent implements OnInit, OnDestroy {
  loading$ :Observable<boolean>;
  employees$ : Observable<Employee[]>;
  columns = ['ID', 'first name', 'last name', 'age', "city", 'street', 'department', 'edit'];
  index = ['userID', 'firstName', 'lastName', 'age', 'city', 'street', 'department'];
  filters: Object;
  listEmployeesSub: Subscription;
  filtersSub: Subscription;

  constructor(private dialog: MatDialog, private rs: EmployeeService, private router: Router, private employeesQuery: employeeQuery) {}



  ngOnInit() {
    // query is the data loading (is the data updating)
    this.loading$ = this.employeesQuery.selectAreEmployeesLoading$;

    //load list of employees for the first time
    this.listEmployeesSub = this.employeesQuery.selectIsFirstTimeLoading.pipe(
      filter(isItFirstLoading => isItFirstLoading),
      switchMap(isItFirstLoading  => { //we are using switch map here because getEmployees return an observable
          return this.rs.getEmployees();
      })
    ).subscribe(result => {});

    // query updated and filtered (if needed) data
    this.employees$ =this.employeesQuery.selectFilteredEmployees$;

    //query filters from store
    this.filtersSub = this.employeesQuery.filtersChange$.subscribe(filters => {
      this.filters = filters;
    })

  }

  editEmployee(employee: Employee) {
    this.openDialog(employee)
  }

  // open a dialog using edit-employee component
  openDialog(employee: Employee) {
    // creating an instance of MatDialogConfig, which will configure the dialog with a set of default behaviors
    const dialogConfig = new MatDialogConfig();
    //the user will not be able to close the dialog just by clicking outside of it
    dialogConfig.disableClose=true;
    //passing data to dialog
    dialogConfig.data = {id: employee.id};
    this.dialog.open(EditEmployeeComponent, dialogConfig);
  }

  // check is the text in view equal to filter text
  shouldHighlight(employeeElement: any, colName: string) {
    // check if the filters are not empty
    if(this.filters[colName] !== undefined && this.filters[colName] !== '' ){
      return this.filters[colName].toLowerCase() === employeeElement[colName].toLowerCase();
    }
    return false
  }

  // unsubscribe when leaving the component
  ngOnDestroy(): void {
    this.listEmployeesSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }
}
