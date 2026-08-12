/* eslint-disable no-console */

const fs = require('fs')
const childProcess = require('child_process')

const writeFileAndGitAdd = (p, content) => {
  fs.writeFileSync(p, content)
  if (childProcess.spawnSync('git', ['add', p]).status !== 0) {
    throw new Error(`failed to execute git add on ${p}`)
  }
}

// check arguments
const version = process.argv[2]
if (!version) {
  throw new Error('version not given in argv')
}
if (!/[0-9]+\.[0-9]+\.[0-9]+(-alpha\.[0-9]+|-beta\.[0-9]+)?/.test(version)) {
  throw new Error('version illegal')
}

// run eslint
console.info('Run eslint')
if (
  childProcess.spawnSync('npx', ['eslint', 'src'], {
    stdio: 'inherit',
  }).status !== 0
) {
  throw new Error('failed to lint (are there eslint warnings or errors?)')
}

// check git status
const gitStatusRes = childProcess.spawnSync('git', ['diff', '--name-only'], { encoding: 'utf8' })
if (gitStatusRes.status !== 0 || gitStatusRes.stdout.length > 0) {
  throw new Error('failed to check git status (are there uncommitted changes?)')
}

// change package.json version
const pkgPath = 'package.json'
let pkgContent = fs.readFileSync(pkgPath, { encoding: 'utf8' })
let oldVersion
pkgContent = pkgContent.replace(/"version": "(.+)"/, (_, v) => {
  oldVersion = v
  return `"version": "${version}"`
})
if (!oldVersion) {
  throw new Error('version segment not found in package.json')
}
console.info(`Update package.json version from "${oldVersion}" to "${version}"`)
writeFileAndGitAdd(pkgPath, pkgContent)

// npm install
console.info('Run npm install')
if (childProcess.spawnSync('npm', ['install'], { stdio: 'inherit' }).status !== 0) {
  throw new Error('failed to npm install')
}

// build
console.info('Build')
if (childProcess.spawnSync('npm', ['run', 'build'], { stdio: 'inherit' }).status !== 0) {
  throw new Error('failed to build')
}

// npm test
console.info('Run npm test')
if (childProcess.spawnSync('npm', ['test'], { stdio: 'inherit' }).status !== 0) {
  throw new Error('failed to npm test')
}

// add lock file
if (childProcess.spawnSync('git', ['add', 'package-lock.json']).status !== 0) {
  throw new Error('failed to execute git add on package-lock.json')
}

// git commit
if (
  childProcess.spawnSync('git', ['commit', '--message', `version: ${version}`], {
    stdio: 'inherit',
  }).status !== 0
) {
  throw new Error('failed to execute git commit')
}

// add a git tag and push
console.info('Push to git origin')
if (childProcess.spawnSync('git', ['tag', `v${version}`]).status !== 0) {
  throw new Error('failed to execute git tag')
}
if (childProcess.spawnSync('git', ['push'], { stdio: 'inherit' }).status !== 0) {
  throw new Error('failed to git push')
}
if (childProcess.spawnSync('git', ['push', '--tags'], { stdio: 'inherit' }).status !== 0) {
  throw new Error('failed to git push --tags')
}

console.info('Version updated!')
