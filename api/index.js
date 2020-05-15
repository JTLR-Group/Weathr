module.exports = (req, res) => {
  res.status(200).send(`Hello ${JSON.stringify(req)}!`)
}
