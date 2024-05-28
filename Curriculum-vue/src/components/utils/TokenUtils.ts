import { deCode, enCode } from '../utils/EncodeUtils'

//根据userAccount创建token
export function buildToken(primevalToken: string) {
  const cryptoStr: string = enCode(primevalToken)
  return primevalToken + '$' + cryptoStr
}

//验证token
export function verifyToken(token: string | null) {
  if (token != null) {
    const split: string[] = token.split('$') //切分明文
    const deCrypto: string = deCode(split[1]) //解密密文
    // console.debug('front: ', split[0], '\ndecode:', deCrypto)
    return deCrypto === split[0]
  } else return false
}

export function getServerToken(): string | null {
  let token = sessionStorage.getItem('token')
  if (token != null) {
    token = token.split('$')[0]
  }
  return token
}
