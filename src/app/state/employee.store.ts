import {Employee} from "../employee.model";
import {EntityState, EntityStore, Store, StoreConfig} from "@datorama/akita";
import {Injectable} from "@angular/core";

//represent our data will look like in the state
export interface EmployeeState extends EntityState<Employee>{
  areEmployeesLoaded: boolean; //are the employees loaded
  ui: {
    filters: {
      department: string;
      city: string
      firstName: string,
      lastName: string
    }
  }
}

//initial state when the data loaded
export  const  getInitialState= () => {
  return {
    areEmployeesLoaded: false, //heck whether the employee entities have already been saved in the state
    ui: {
      filters: {
        department: '',
        city: '',
        firstName: '',
        lastName: ''
      }
    }
  }
};

//creating store class
@Injectable({
  providedIn: 'root'
})
@StoreConfig({name: 'employee'}) //name is given to distinguish between states
export class EmployeeStore  extends EntityStore<EmployeeState>{
  constructor() {
    //calling the initial state
    super(getInitialState());

  }

  //to save the employee entities in the state and also to mark the areCoursesLoaded flag as true
  loadEmployees(employees: Employee[], areEmployeesLoaded: boolean) {
    this.set(employees);
    this.update(state => ({
      ...state,
      areEmployeesLoaded
    }));
    this.setLoading(false);
  }

  updateEmployee(id: string, employee: Employee, areEmployeesLoaded){
    this.update(id, employee);
    this.setLoading(false);
  }



}
