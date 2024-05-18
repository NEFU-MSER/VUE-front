import { deCode, enCode } from '../utils/EncodeUtils'
import { type User } from '@/components/classes/User'

//根据userAccount创建token
export function buildToken(user: User) {
  //console.debug(user._userName)
  const userData: string = '{(' + user._userAccount + ')(' + Date.now().toString() + ')}'
  const cryptoStr: string = enCode(userData)
  // noinspection UnnecessaryLocalVariableJS
  const token: string = userData + '$' + cryptoStr
  //console.debug('userdata:', userData, '\ntoken:', token)
  return token
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
