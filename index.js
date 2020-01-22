function getPipeIn(timeout = 100) {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) resolve()
    else {
      let stdin = process.openStdin()
      let pipeInData

      Promise.race([
        new Promise(res => {
          setTimeout(function() {
            process.stdin.destroy()
            res(false)
          },timeout)
        }),
        new Promise(res => {
          stdin.on('data', function(chunk) {
            if (pipeInData === undefined) {
              pipeInData = ""
              res(true)
            }
            pipeInData += chunk
          })
        })
      ]).then(res => {
        if (res) {
          stdin.on('end', function() {
            resolve(pipeInData)
          })
        } else resolve(pipeInData)
      })
    }
  })
}

module.exports = getPipeIn