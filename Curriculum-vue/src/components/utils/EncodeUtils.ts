import CryptoJS from 'crypto-js'

let Key = CryptoJS.enc.Utf8.parse('KUKUKING-securityKey') //默认密钥

export function setKey(key: string) {
  Key = CryptoJS.enc.Utf8.parse(key) //修改密钥
}

//加密字符串
export function enCode(data: string) {
  const encrypted = CryptoJS.AES.encrypt(data, Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // console.debug('encrypted data:', encrypted.toString())
  return encrypted.toString()
}

//解密字符串
export function deCode(enCodeData: string) {
  const decrypted = CryptoJS.AES.decrypt(enCodeData, Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  const result: string = CryptoJS.enc.Utf8.stringify(decrypted).toString()
  // console.debug('decrypted data:', result)
  return result
}
