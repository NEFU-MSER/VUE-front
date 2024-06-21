export class PatientCard {
  id: string
  patientId: string
  balance: number
  enable: boolean
  createTime: string

  constructor(id: string, patientId: string, balance: number, enable: boolean, createTime: string) {
    this.id = id
    this.patientId = patientId
    this.balance = balance
    this.enable = enable
    this.createTime = createTime
  }

  getGender(): string {
    switch (this.balance) {
      case 0:
        return 'male'
      case 1:
        return 'female'
      default:
        return 'male'
    }
  }
}

export function patientCardBuilder(responseData: any): PatientCard {
  return new PatientCard(
    responseData?.id,
    responseData?.patientId,
    responseData?.balance,
    responseData?.enable,
    responseData?.createTime
  )
}
