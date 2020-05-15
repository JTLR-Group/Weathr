module.exports = (req, res) => {
  res
    .status(200)
    .send(`request is ${req.query} ${req.params ? req.params : ''}`)
}
