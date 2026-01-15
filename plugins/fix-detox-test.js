const { withDangerousMod, withAppBuildGradle } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')


const ensureDir = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const findDetoxTest = root => {
  const target = []
  const walk = dir => {
    const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []
    for (const e of entries) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.isFile() && e.name === 'DetoxTest.java') target.push(full)
    }
  }
  walk(root)
  return target[0]
}

const applyRewrites = (src, pkg) => {
  let content = fs.readFileSync(src, 'utf8')
  content = content.replace(/package\s+[\w.]+;/, `package ${pkg};`)
  content = content.replace(/import\s+com\.[\w.]+\.MainActivity;/, `import ${pkg}.MainActivity;`)
  content = content.replace(/import\s+com\.[\w.]+\.BuildConfig;/, `import ${pkg}.BuildConfig;`)
  return content
}

const moveAndRewriteDetoxTest = (projectRoot, packageName) => {
  const testJavaRoot = path.join(projectRoot, 'android', 'app', 'src', 'androidTest', 'java')
  const targetDir = path.join(testJavaRoot, ...packageName.split('.'))
  ensureDir(targetDir)

  const existing = findDetoxTest(testJavaRoot) || path.join(testJavaRoot, 'com', 'appdaloja', 'DetoxTest.java')
  if (!fs.existsSync(existing)) return

  const rewritten = applyRewrites(existing, packageName)
  const targetFile = path.join(targetDir, 'DetoxTest.java')
  fs.writeFileSync(targetFile, rewritten, 'utf8')

  if (existing !== targetFile) {
    try { fs.unlinkSync(existing) } catch {}
    const legacyDir = path.dirname(existing)
    const removeIfEmpty = dir => {
      if (!fs.existsSync(dir)) return
      const entries = fs.readdirSync(dir).filter(name => name !== '.DS_Store')
      if (entries.length === 0) {
        try { fs.rmdirSync(dir) } catch {}
      }
    }
    removeIfEmpty(legacyDir)
    const parentDir = path.dirname(legacyDir)
    removeIfEmpty(parentDir)
  }
}

module.exports = function withFixAndroidDetoxTest(config) {
  let androidPackage = config.android?.package

  config = withAppBuildGradle(config, cfg => {
    if (!androidPackage) {
      const gradle = cfg.modResults.contents || ''
      const m = gradle.match(/applicationId\s+'([^']+)'/)
      androidPackage = m?.[1]
    }
    return cfg
  })

  config = withDangerousMod(config, [
    'android',
    cfg => {
      const projectRoot = cfg.modRequest.projectRoot
      if (androidPackage) moveAndRewriteDetoxTest(projectRoot, androidPackage)
      return cfg
    }
  ])
  return config
}
