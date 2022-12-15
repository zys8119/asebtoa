import {obfuscate} from 'javascript-obfuscator'
import {readFileSync} from 'fs-extra'
import {resolve} from 'path'
import tsBuild from 'ts-node-build'
import {create} from 'ts-node'
import {buildSync} from 'esbuild'
new tsBuild({
    inputFiles:[
        "src/*",
        "package.json",
        "README.md",
    ],
    rules:[
        {
            rule:/\.ts$/,
            transform({code, targetFileParse:{name,ext}, file, targetFilePath}): Promise<string | void> | string | void {
                try {
                    const resCode = create({
                        compilerOptions:{
                            sourceMap:false
                        }
                    }).compile(code, name+ext)
                    console.log(buildSync({
                        entryPoints:[file],
                        // outfile:resolve(targetFilePath, '..', `${name}.js`),
                        bundle:true,
                        minify:true,
                        tsconfig:"tsconfig.json"
                    }).outputFiles)
                    return code
                }catch (e){
                    console.error(e)
                    return  code
                }

            }
        },
        {
            rule:/package\.json$/,
            transform({code}): Promise<string | void> | string | void {
                const codeData:any = JSON.parse(code) as any
                delete codeData.devDependencies
                delete codeData.scripts
                delete codeData.dependencies
                codeData.main = "src/index.js"
                return JSON.stringify(codeData, null, 4)
            }
        }
    ]
}).compile()
