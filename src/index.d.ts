/**
 * 加密
 */
export const encrypt:(message:string, key?:string, tag?:string)=> string

/**
 * 解密
 */
export const decrypt:(ciphertext:string, tag?:string)=> string
