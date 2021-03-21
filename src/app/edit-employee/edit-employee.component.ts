import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RestService} from "../state/rest.service";
import {employeeQuery} from "../state/employee.query";
import {Employee} from "../employee.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEmployeeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  IDs:string[];
  prevEmployeeInfo: Employee;
  IDsub: Subscription;
  prevEmployeeInfoSub: Subscription;

  constructor(private rs: RestService, public dialogRef: MatDialogRef<EditEmployeeComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private employeesQuery: employeeQuery) { }

  ngOnInit(): void {
    this.IDsub = this.employeesQuery.updatedIIDs$.subscribe(res => {this.IDs = res})
    this.prevEmployeeInfoSub = this.employeesQuery.selectEntity(this.data.id).subscribe(res => {this.prevEmployeeInfo={...res}});
    this.form = new FormGroup({
      'userID': new FormControl(this.prevEmployeeInfo.userID,[Validators.required, this.isValidID.bind(this), Validators.pattern("^\\d{9}$") ]),
      'firstName': new FormControl(this.prevEmployeeInfo.firstName, [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]),
      'lastName': new FormControl(this.prevEmployeeInfo.lastName, [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]),
      'age': new FormControl(this.prevEmployeeInfo.age, [Validators.required, Validators.pattern("^[0-9]*$")]),
      'city': new FormControl(this.prevEmployeeInfo.city, [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]),
      'street': new FormControl( this.prevEmployeeInfo.street, [Validators.required, Validators.pattern("^[a-zA-Z0-9_.-\\s]*$")]) ,
      'department': new FormControl(this.prevEmployeeInfo.department, [Validators.required])});


  }


  // updating employee information after submission
  onSubmit(){
    this.rs.updateEmployee(this.prevEmployeeInfo.id.toString(), this.form.value);
    this.onClose()
  }

  // closing dialog
  onClose(){
    this.dialogRef.close()
  }

  // check ID validation
  isValidID(control: FormControl): { [s: string]: boolean } {
    //if ID exist in the list, but it's the original ID of the employee
    if (this.IDs.indexOf(control.value) !== -1 && this.prevEmployeeInfo.userID=== control.value) {
      return null;
    }
    // if the ID not exist in ID's list
    if(this.IDs.indexOf(control.value) === -1){
      return null;
    } else {
      return {'idIsUsed': true};
    }
  }

  // choosing which error to show by the error type detected
  chooseErrorForID() {
    if (this.form.controls['userID'].hasError('idIsUsed')){
      return 'This ID is already in use';
    }
    if (this.form.controls['userID'].hasError('required')){
      return 'This filed is required';
    }
    if(this.form.controls['userID'].hasError("pattern")) {
      return 'You must enter 9 digits';
    }else
    {
      return ''
    }
  }

  // unsubscribe when leaving the component
  ngOnDestroy(): void {
    this.prevEmployeeInfoSub.unsubscribe();
    this.IDsub.unsubscribe();
  }
}
