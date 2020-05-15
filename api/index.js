const fetchAddressInfo = (latlong, res) => {
  const url = `https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${latlong},&hitsPerPage=1&language=en`
  axios
    .get(url, {headers: HEADERS})
    .then((response) => {
      const {data} = response
      res.status(200)
      res.json(data)
    })
    .catch((err) => {
      res.status(err.response ? err.response.status : 500)
      res.send(err.message || 'Something went wrong! Please try again later.')
    })
}

const fetchCities = (req) => {
  const {city, latlong} = req.query
  axios
    .request({
      url: 'https://places-dsn.algolia.net/1/places/query',
      method: 'post',
      data: {
        query: city,
        type: 'city',
        aroundLatLng: latlong,
      },
      headers: HEADERS,
    })
    .then((response) => {
      const {data} = response
      res.status(200)
      res.json(data)
    })
    .catch((err) => {
      res.status(err.response ? err.response.status : 500)
      res.send(err.message || 'Something went wrong! Please try again later.')
    })
}

const fetchForecast = (latlong) => {
  const url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${latlong}?extend=hourly&exclude=minutely,flags`
  axios
    .get(url)
    .then((response) => {
      const {data} = response
      res.status(200)
      res.json(data)
    })
    .catch((err) => {
      res.status(err.response ? err.response.status : 500)
      res.send(err.message || 'Something went wrong! Please try again later.')
    })
}

module.exports = (req, res) => {
  const {type, latlong} = req.query

  fetchAddressInfo: () => {
    const url = `https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${latlong},&hitsPerPage=1&language=en`
    axios
      .get(url, {headers: HEADERS})
      .then((response) => {
        const {data} = response
        res.status(200)
        res.json(data)
      })
      .catch((err) => {
        res.status(err.response ? err.response.status : 500)
        res.send(err.message || 'Something went wrong! Please try again later.')
      })
  }

  fetchCities: () => {
    const {city, latlong} = req.query
    axios
      .request({
        url: 'https://places-dsn.algolia.net/1/places/query',
        method: 'post',
        data: {
          query: city,
          type: 'city',
          aroundLatLng: latlong,
        },
        headers: HEADERS,
      })
      .then((response) => {
        const {data} = response
        res.status(200)
        res.json(data)
      })
      .catch((err) => {
        res.status(err.response ? err.response.status : 500)
        res.send(err.message || 'Something went wrong! Please try again later.')
      })
  }

  switch (type) {
    case 'address':
      fetchAddressInfo()
      break
    case 'places':
      fetchCities()
      break
    case 'forecast':
      fetchForecast()
      break
    default:
      res.send('Welcome to Weather React API')
      break
  }
}
