import {ID} from "@datorama/akita";

export interface Employee {
  id: ID;
  "userID": string,
  firstName: string,
  lastName: string,
  age: string,
  city: string,
  street: string,
  department: string
}
