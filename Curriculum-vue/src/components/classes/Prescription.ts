import { DateBuilder } from '@/components/utils/DateTimeUtils'

export class Prescription {
  id: string
  doctorId: string
  patientId: string
  cardId: string
  cost: number
  title: string
  description: string
  finish: boolean = false
  toFinish: boolean = false
  createTime: Date
  updateTime: Date

  constructor(
    id: string,
    doctorId: string,
    patientId: string,
    cardId: string,
    cost: number,
    title: string,
    description: string,
    createTime?: Date,
    updateTime?: Date
  ) {
    this.id = id
    this.doctorId = doctorId
    this.patientId = patientId
    this.cardId = cardId
    this.cost = cost
    this.title = title
    this.description = description
    this.createTime = createTime ? createTime : new Date(Date.now())
    this.updateTime = updateTime ? updateTime : new Date(Date.now())
  }
}

export function prescriptionBuilder(responseData: any): Prescription {
  const temp = new Prescription(
    responseData?.id,
    responseData?.doctorId,
    responseData?.patientId,
    responseData?.cardId,
    responseData?.cost,
    responseData?.title,
    responseData?.description,
    DateBuilder(responseData?.create_time),
    DateBuilder(responseData?.update_time)
  )
  temp.toFinish = responseData?.toFinish
  temp.finish = responseData?.finish
  return temp
}
