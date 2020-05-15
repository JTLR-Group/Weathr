module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    params: req.params,
    cookies: req.cookies,
  })
}
