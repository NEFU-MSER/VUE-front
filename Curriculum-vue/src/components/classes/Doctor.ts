export class Doctor {
  id: string
  roleId: string
  name: string
  idCard: string
  phone: string
  email: string
  gender: number

  constructor(
    id: string,
    roleId: string,
    name: string,
    idCard: string,
    phone: string,
    email: string,
    gender: number
  ) {
    this.id = id
    this.roleId = roleId
    this.name = name
    this.idCard = idCard
    this.phone = phone
    this.email = email
    this.gender = gender
  }

  getGender(): string {
    switch (this.gender) {
      case 0:
        return '男'
      case 1:
        return '女'
      default:
        return '男'
    }
  }
}

export function doctorBuilder(responseData: any): Doctor {
  return new Doctor(
    responseData?.id,
    responseData?.roleId,
    responseData?.name,
    responseData?.idCard,
    responseData?.phone,
    responseData.email,
    responseData?.gender
  )
}
