import {ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RestService} from "../state/rest.service";
import {employeeQuery} from "../state/employee.query";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEmployeeComponent implements OnInit {
  form: FormGroup;
  IDs:string[];

  constructor(private rs: RestService, public dialogRef: MatDialogRef<EditEmployeeComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private employeesQuery: employeeQuery) { }

  ngOnInit(): void {
    this.employeesQuery.updatedIIDs$.subscribe(res => {this.IDs = res})
    this.form = new FormGroup({
      'userID': new FormControl(this.data.userID,[Validators.required, this.isValidID.bind(this) ]),
      'firstName': new FormControl(this.data.firstName, [Validators.required]),
      'lastName': new FormControl(this.data.lastName, Validators.required),
      'age': new FormControl(this.data.age, Validators.required),
      'city': new FormControl(this.data.city, Validators.required),
      'street': new FormControl( this.data.street, Validators.required) ,
      'department': new FormControl(this.data.department, Validators.required) });





  }

  onSubmit(){
    //actions
    this.rs.updateEmployee(this.data.id, this.form.value).subscribe(result => console.log(result))
    this.onClose()
  }

  onClose(){
    this.dialogRef.close()
  }

  isValidID(control: FormControl): { [s: string]: boolean } {
    if (this.IDs.indexOf(control.value) !== -1 && this.data.userID=== control.value) { // if the ID not exist in ID's list
      console.log("i'm the same id")
      return null;
    }
    if(this.IDs.indexOf(control.value) === -1){
      console.log("i'm am a new id")
      return null;
    } else {
      console.log('i return a validation error')
      return {'idIsUsed': true};
    }
  }

  chooseErrorForID() {
    if (this.form.controls['userID'].hasError('idIsUsed')){
      return 'This ID is already in use';
    }
    if (this.form.controls['userID'].hasError('required')){
      return 'This filed is required';
    } else{
      return ''
    }
  }
}
