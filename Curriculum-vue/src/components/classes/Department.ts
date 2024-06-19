export class Department {
  id: string
  parentId: string
  name: string
  description: string
  children: Array<Department>

  constructor(id: string, parentId: string, name: string) {
    this.id = id
    this.parentId = parentId
    this.name = name
    this.description = ''
    this.children = []
  }
}

export function departmentBuilder(responseData: any): Department {
  const temp = new Department(responseData?.id, responseData?.parentId, responseData?.name)
  if (responseData?.description) {
    temp.description = responseData?.description
  }
  return temp
}

export function structured(
  departments: Array<Department>,
  target: string = '0000000000000000000'
): Department[] {
  const results = new Array<Department>()
  for (const department of departments) {
    if (department.parentId === target) {
      results.push(department)
    }
  }
  for (const result of results) {
    result.children = structured(departments, result.id)
  }
  return results
}

export function equal(departments: Array<Department>, target: string): boolean {
  for (const department of departments) {
    if (department.id === target) {
      return true
    }
    if (equal(department.children, target)) {
      return true
    }
  }
  return false
}

export function toList(departments: Array<Department>): Array<Department> {
  const result = Array<Department>()
  for (const department of departments) {
    result.push(department)
    result.concat(toList(department.children))
  }
  return result
}
