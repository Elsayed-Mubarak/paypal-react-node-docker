module.exports = (fn) => {
  console.log(' ...... catch errors middelware ...... ')

  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
