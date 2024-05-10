import CryptoJS from 'crypto-js'

let Key = CryptoJS.enc.Utf8.parse('KUKUKING-securityKey')

export function setKey(key: string) {
  Key = CryptoJS.enc.Utf8.parse(key)
}

export function enCode(data: string) {
  const encrypted = CryptoJS.AES.encrypt(data, Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  console.debug('encrypted data:', encrypted.toString())
  return encrypted.toString()
}

export function deCode(enCodeData: string) {
  const decrypted = CryptoJS.AES.decrypt(enCodeData, Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  const result: string = CryptoJS.enc.Utf8.stringify(decrypted).toString()
  console.debug('decrypted data:', result)
  return result
}
