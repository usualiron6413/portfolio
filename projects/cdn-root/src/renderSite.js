require('colors')
const pug = require('pug')
const path = require('path')
const fs = require('fs')

const pages = require('./pages')

const outputFolder = path.resolve('dist')

try {
  if (fs.existsSync(outputFolder)) {
    console.log('removing folder...'.yellow)

    fs.rmdirSync(outputFolder, {
      recursive: true
    })
  }

  console.log('creating folder...'.blue)

  fs.mkdirSync(outputFolder)

  pages.forEach(page => {
    const data = pug.renderFile(page.templatePath, page.locals)
    fs.writeFileSync(`${outputFolder}/${page.fileName}`, data)
  })

  console.log('render pass'.green)
} catch (error) {
  console.error('render fail'.red, error)

  if (fs.existsSync(outputFolder)) {
    fs.rmdirSync(outputFolder, {
      recursive: true
    })
  }
} finally {
  process.exit()
}
