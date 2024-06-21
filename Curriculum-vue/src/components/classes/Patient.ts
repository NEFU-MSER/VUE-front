export class Patient {
  id: string
  name: string
  idCard: string
  phone: string
  email: string
  gender: number

  constructor(
    id: string,
    name: string,
    idCard: string,
    phone: string,
    email: string,
    gender: number
  ) {
    this.id = id
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

export function patientBuilder(responseData: any): Patient {
  return new Patient(
    responseData?.id,
    responseData?.name,
    responseData?.idCard,
    responseData?.phone,
    responseData.email,
    responseData?.gender
  )
}
