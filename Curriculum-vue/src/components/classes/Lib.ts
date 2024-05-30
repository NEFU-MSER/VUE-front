export class Lib {
  id: string | null = null;

  name: string
  type: string

  constructor(id: string | null, name: string, type: string) {
    this.id = id
    this.name = name
    this.type = type
  }
}

export function libBuilder(responseData: any): Lib{
  return new Lib(
    responseData?.id,
    responseData?.name,
    responseData?.type
  )
}
