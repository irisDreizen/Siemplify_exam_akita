import {Routes} from "@angular/router";
import {EmployeeViewComponent} from "./employee-view/employee-view.component";
import {EditEmployeeComponent} from "./edit-employee/edit-employee.component";



export const routes: Routes = [{
  path:'',
  component:EmployeeViewComponent
},
  {
    path: 'editEmployee',
    component: EditEmployeeComponent
  }];

