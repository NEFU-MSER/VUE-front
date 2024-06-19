export class Role {
  id: string
  name: string
  departmentId: string
  expenses: number

  constructor(id: string, name: string, departmentId: string, expenses: number) {
    this.id = id
    this.name = name
    this.departmentId = departmentId
    this.expenses = expenses
  }
}

export function roleBuilder(responseData: any): Role {
  return new Role(
    responseData?.id,
    responseData?.name,
    responseData?.departmentId,
    responseData?.expenses
  )
}
