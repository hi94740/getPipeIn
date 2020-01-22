function getPipeIn(timeout = 100) {
  return new Promise((resolve) => {
    // Detects whether stdin is connected to a terminal or not
    if (process.stdin.isTTY) resolve()
    else {
      let stdin = process.openStdin()
      let pipeInData

      Promise.race([
        new Promise(res => {
          // Timeout
          setTimeout(function() {
            process.stdin.destroy()
            res(false)
          },timeout)
        }),
        new Promise(res => {
          // Detects whether stdin is a pipe
          require("fs").fstat(0,(err,stat) => {
            if (!err) {
              if (!stat.isFIFO()) {
                process.stdin.destroy()
                res(false)
              }
            }
          })
        }),
        new Promise(res => {
          // Waiting for stdin to spit out pipe data
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