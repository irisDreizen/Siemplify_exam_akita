import {Component, OnInit, Inject, inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Employee} from "../employee.model";
import {RestService} from "../state/rest.service";

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  form: FormGroup;


  constructor(private rs: RestService, public dialogRef: MatDialogRef<EditEmployeeComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = new FormGroup({ 'id': new FormControl(this.data.id),
      'firstName': new FormControl(this.data.firstName),
      'lastName': new FormControl(this.data.lastName),
      'age': new FormControl(this.data.age),
      'city': new FormControl(this.data.city),
      'street': new FormControl( this.data.street) ,
      'department': new FormControl(this.data.department) });

  }

  onSubmit(){
    //actions
    this.rs.updateEmployee(this.form.value.id, this.form.value).subscribe(result => console.log(result))
    this.onClose()
  }

  onClose(){
    this.dialogRef.close()
  }

}
