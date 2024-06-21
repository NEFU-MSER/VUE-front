import { DateBuilder } from '@/components/utils/DateTimeUtils'

export class TradeLog {
  id: string
  cardId: string
  reason: string
  execute: number
  createTime: Date

  constructor(id: string, cardId: string,reason: string, execute: number, createTime: Date) {
    this.id = id
    this.cardId = cardId
    this.reason = reason
    this.execute = execute
    this.createTime = createTime
  }
}

export function tradeLogBuilder(responseData: any): TradeLog {
  return new TradeLog(
    responseData?.id,
    responseData?.cardId,
    responseData?.reason,
    responseData?.execute,
    DateBuilder(responseData?.createTime)
  )
}
