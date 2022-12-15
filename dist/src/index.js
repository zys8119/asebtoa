import {AES, enc} from "crypto-js"
export const decrypt = (ciphertext:string, tag:string = '[...]')=> {
    try {
        let b = atob(ciphertext)
        const reg = new RegExp(`.*${tag.replace(/\[/g,'\\[').replace(/\]/g,'\\]').replace(/\./g,'\\.')}`)
        const valueKey = Object.entries(b.match(reg).toString()).filter((e,k)=>!(k%2)).map(e=>e[1]).join("").replace(/\[?\.+\]$/,'')
        const index = b.indexOf(tag)
        const value = Object.entries(b.replace(tag, " ")).filter((e,k)=>k%2 || k > index).map(e=>e[1]).join("").trim()
        return AES.decrypt(value, atob(valueKey)).toString(enc.Utf8)
    }catch (e){
        return ''
    }
}
export const encrypt = (message:string, key:string = '', tag:string = '[...]')=> {
    try {
        let result =''
        const str = AES.encrypt(message, key).toString()
        const value = Object.entries(str)
        let valueKey = btoa(key)
        let isEnd = false
        let index = valueKey.length - value.length
        if(index > 0){
            new Array(index+1).fill(0).forEach((e, k)=>{
                value.push([String((str.length + k)), " "])
            })
        }
        for (const [k , v] of value){
            if(valueKey[k]){
                result += valueKey[k]
            }else if(!isEnd){
                result += tag
                isEnd = true
            }
            result += v
        }
        return btoa(result)
    }catch (e){
        return ''
    }
}
