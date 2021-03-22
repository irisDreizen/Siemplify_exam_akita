import {Employee} from "../employee.model";
import {EntityState, EntityStore, Store, StoreConfig} from "@datorama/akita";
import {Injectable} from "@angular/core";

//adding data to the state
export interface EmployeeState extends EntityState<Employee>{
  isFirstTime:boolean;
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
    isFirstTime:true,
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
  loadEmployees(employees: Employee[], isFirstTime) {
    this.set(employees);
    this.update(state => ({
      ...state,
      isFirstTime: isFirstTime
    }));
  }

  updateEmployee(id: string, employee: Employee){
    this.update(id, employee);
    this.setLoading(false);

  }



}
