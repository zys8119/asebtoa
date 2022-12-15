import tsBuild from 'ts-node-build'
import {build, buildSync} from 'esbuild'
import {resolve} from 'path'
new tsBuild({
    inputFiles:[
        "src/*",
        "package.json",
        "README.md",
    ],
    rules:[
        {
            rule:/index\.ts$/,
            outFileName:"[name].js",
            transform({ file, targetFileParse:{name}, targetFilePathDir}): Promise<string | void> | string | void {
                buildSync({
                    entryPoints:[file],
                    outfile:resolve(targetFilePathDir, name+'.mjs'),
                    bundle:true,
                    minify:true,
                    format:"esm",
                })
                return build({
                    entryPoints:[file],
                    bundle:true,
                    minify:true,
                    write:false,
                    platform:"node",
                }).then(res=>{
                    return res.outputFiles[0].text
                })
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
                codeData.module = "src/index.mjs"
                return JSON.stringify(codeData, null, 4)
            }
        }
    ]
}).compile()
