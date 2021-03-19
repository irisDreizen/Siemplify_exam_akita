import { Component, OnInit } from '@angular/core';
import {RestService} from "../state/rest.service";
import {Employee} from "../employee.model";
import {Router} from "@angular/router";
import {employeeQuery} from "../state/employee.query";
import {EmployeeStore} from "../state/employee.store";
import {filter, switchMap, take} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditEmployeeComponent} from "../edit-employee/edit-employee.component";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {
  loaded = false;
  employees$: Observable<Employee[]> = this.employeesQuery.selectAll();
  columns = ['ID', 'first name', 'last name', 'age', "city", 'street', 'department', 'edit'];
  index = ['id', 'firstName', 'lastName', 'age', 'city', 'street', 'department'];
  listEmployeesSub: Subscription;
  // constructor() { }

  constructor(private dialog: MatDialog, private rs: RestService, private router: Router, private employeesQuery: employeeQuery, private employeeStore: EmployeeStore) {}



  ngOnInit() {
    this.listEmployeesSub = this.employeesQuery.selectAreEmployeesLoaded$.pipe(
      filter(areEmployeesLoaded => !areEmployeesLoaded),
      switchMap(areEmployeesLoaded  => {
        if (!areEmployeesLoaded ) {
          return this.rs.getEmployees();
        }
      })
    ).subscribe(result => {});
    this.employeesQuery.selectAreEmployeesLoaded$.subscribe(res => this.loaded = res)
  //   console.log('1')
  //   this.employeesQuery.getLoading().subscribe(res => this.loading = res)
  //   this.employeesQuery.getEmployees().subscribe(res => this.employees = res)
  //   console.log('2')
  //   //first we will check if employees loaded
  //   this.employeesQuery.getLoaded().pipe(
  //     take(1), //fetch the data from the store only once
  //     filter(res => !res), //only if loaded is false, the switch map will be executed
  //     switchMap(() => {
  //       this.employeeStore.setLoading(true);
  //       return this.rs.getEmployees();
  // })).subscribe( res => {
  //   this.employeeStore.update(state =>{
  //     return {
  //       employees: res
  //     };
  //     })
  //     this.employeeStore.setLoading(false)
  //   }, error => {
  //     console.log(error)
  //     this.employeeStore.setLoading(false)
  //   });
  //

  }

  editEmployee(employee: Employee) {
    // this.router.navigate(['/editEmployee']);
    this.openDialog(employee)
  }
  openDialog(employee: Employee) {
    //we are then creating an instance of MatDialogConfig, which will configure the dialog with a set of default behaviors
    const dialogConfig = new MatDialogConfig();
    // user will not be able to close the dialog just by clicking outside of it
    // dialogConfig.disableClose = true;
    // //focus will be set automatically on the first form field of the dialog
    // dialogConfig.autoFocus = true;
    dialogConfig.data = employee;
    let dialogRef = this.dialog.open(EditEmployeeComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result)
    //   let newEmployee = {
    //     firstName: result.firstName,
    //     lastName: result.lastName,
    //     age: result.age,
    //     city: result.city,
    //     street: result.street,
    //     department: result.department
    //   }
    //   console.log("newEmployee from view")
    //   console.log(newEmployee)
    //   this.rs.updateEmployee(result.id, newEmployee)
    // })
  }
}
