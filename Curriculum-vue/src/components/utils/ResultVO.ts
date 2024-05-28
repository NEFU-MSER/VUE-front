export class ResultVO {
  code: number
  message?: string
  data?: Map<string, any>

  constructor(code: number, message: string, ...maps: [string, any][]) {
    this.code = code
    this.message = message
    this.data = new Map<string, any>()
    for (const map of maps) {
      this.data.set(map[0], map[1])
    }
  }
}
