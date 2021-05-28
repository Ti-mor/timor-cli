#!/usr/bin/env node

// Node cli 应用入口文件必须要有这样的文件头
// 如果是 linux 或 macOS 系统下还需要修改此文件的读写权限为755
// 具体就是通过 chmod 755 cli.js 实现修改

// 脚手架的工作过程
// 1.通过命令行交互询问用户问题
// 2.根据用户回答的结果生成文件

const inquirer = require('inquirer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')


inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Your project name'
  }
])
.then(answers => {
  // console.log(answers)
  // 根据用户回答的结果生成文件

  // 模板目录
  const tmpDir = path.join(__dirname, 'templates')
  // 目标目录
  const destDir = process.cwd()

  // ---------------------------------------------------

  // // 将模板目录下的文件全部转换到目标目录
  // fs.readdir(tmpDir, (err, files) => {
  //   if (err) throw err
  //   files.forEach(file => {
  //     console.log(file)
  //     // 通过模板引擎渲染文件
  //     ejs.renderFile(path.join(tmpDir, file), answers, (err, result) => {
  //       if (err) throw err
  //       // console.log(result)
  //       // 将结果写入目标文件路径
  //       fs.writeFileSync(path.join(destDir, file), result)
  //     })
  //   })
  // })

  // ---------------------------------------------------
  
  const readdir = (formDir, toDir) => {
    fs.readdir(formDir, (err, files) => {
      if (err) throw err
      
      files.forEach(file => {
        fs.stat(path.join(formDir, file), (err, stats) => {
          if (err) throw err

          if (stats.isDirectory()) {
            fs.mkdir(path.join(toDir, file),err => {
              if (err) throw err

              readdir(path.join(formDir, file), path.join(toDir, file))
           })
          } else {
            // 通过模板引擎渲染文件
            ejs.renderFile(path.join(formDir, file), answers, (err, result) => {
              if (err) throw err

              // console.log(result)
              // 将结果写入目标文件路径
              fs.writeFileSync(path.join(toDir, file), result)
            })
          }
        })
      })
    })
  }
  readdir(tmpDir, destDir)

})

