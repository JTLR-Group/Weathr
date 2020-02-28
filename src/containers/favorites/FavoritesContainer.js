import React, {useState, useContext, useEffect, useRef, Fragment} from 'react'
import {AddressContext} from '../../context/AddressContext'
import CurrentWeatherContainer from '../current-weather/CurrentWeatherContainer'
import ForecastContainer from '../forecast/ForecastContainer'
import FetchWeatherData from './../../utils/FetchWeatherData'
import {sortBy, isUndefined} from 'lodash-es'
import Carousel from 'nuka-carousel'
import CarouselSettings from '../../utils/CarouselSettings'
import FormattedDateTime from './../../utils/FormattedDateTime'
import {ThemeContext} from '../../context/ThemeContext'
import FavoriteComponent from '../../components/favorite/FavoriteComponent'

const FavoritesContainer = () => {
  const {favorites, updateFavorites} = useContext(AddressContext)
  const {theme, colorTheme} = useContext(ThemeContext)
  const [selectedFavorite, setSelectedFavorite] = useState({})
  const [favoriteWeather, setFavoriteWeather] = useState({})
  const [slideIndex, setSlideIndex] = useState(0)
  const [formattedDateTime, setFormattedDateTime] = useState('')
  const weatherRef = useRef(null)

  // scroll to weather component when selectedFavorite is set
  const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

  const selectFavoriteHandler = async index => {
    if (favorites[index]) {
      setSelectedFavorite({...favorites[index]})
      const formattedString = await FormattedDateTime(favorites[index].latlong)
      setFormattedDateTime(formattedString)
    }
    setSlideIndex(index)
  }

  const fetchWeatherData = () => {
    if (
      selectedFavorite !== undefined &&
      Object.keys(selectedFavorite).length
    ) {
      FetchWeatherData(selectedFavorite).then(data => {
        setFavoriteWeather(state => ({...state, ...data}))
        scrollHandler()
      })
    }
  }

  const scrollHandler = () => {
    scrollToRef(weatherRef)
  }

  useEffect(() => {
    fetchWeatherData()
    const timer = setInterval(() => {
      fetchWeatherData()
    }, 3600000)
    // update favorites
    const timeout = setTimeout(() => {
      if (localStorage.getItem('favorites')) {
        const fav = JSON.parse(localStorage.getItem('favorites'))
        // sort favorites by cityName
        updateFavorites({
          favorites: sortBy(fav, ['address.cityName'])
        })
      }
    }, 1000)
    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
    }
    // eslint-disable-next-line
  }, [selectedFavorite])

  return (
    <Fragment>
      {favorites.length > 0 ? (
        <div className={`bg-${theme} py-10`}>
          <p className={`text-center font-bold text-2xl text-${colorTheme}`}>
            Favorites
          </p>
          {/* mobile */}
          <div className='sm:hidden px-5 py-5'>
            <Carousel
              {...CarouselSettings('favorite')}
              slideIndex={slideIndex}
              afterSlide={slideIndex => selectFavoriteHandler(slideIndex)}>
              {favorites.map((favorite, index) => {
                return (
                  <FavoriteComponent
                    key={favorite.latlong}
                    favorite={favorite}
                    favoriteSelected={() => selectFavoriteHandler(index)}
                  />
                )
              })}
            </Carousel>
          </div>
          {/* tablet and above devices */}
          <div className='hidden sm:flex  justify-center items-center'>
            <div className='sm:w-5/6 xl:w-1/2 px-5 py-5'>
              <div className='flex sm:flex-row flex-wrap justify-center'>
                {favorites.map((favorite, index) => {
                  return (
                    <div
                      className='m-2 sm:w-1/2 md:w-1/4 lg:w-1/3'
                      key={favorite.latlong}>
                      <FavoriteComponent
                        key={favorite.latlong}
                        favorite={favorite}
                        favoriteSelected={() => selectFavoriteHandler(index)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div ref={weatherRef}>
            {!isUndefined(selectedFavorite.address) &&
            !isUndefined(favoriteWeather.weatherCurrent) ? (
              <Fragment>
                <div className='flex justify-center px-5 py-10'>
                  <div
                    className={`sm:w-full md:w-5/6 xl:w-1/2 border border-${colorTheme} bg-{theme} text-${colorTheme} rounded-t-2xl shadow-lg`}>
                    <CurrentWeatherContainer
                      weatherCurrent={favoriteWeather.weatherCurrent}
                      address={selectedFavorite.address}
                      latlong={selectedFavorite.latlong}
                      urbanArea={selectedFavorite.urbanArea}
                      formattedDateTime={formattedDateTime}
                    />
                    <ForecastContainer
                      cityName={selectedFavorite.address.cityName}
                      weatherForecast={favoriteWeather.weatherForecast}
                      formattedDateTime={formattedDateTime}
                    />
                  </div>
                </div>
                <div>
                  {selectedFavorite.urbanArea.slug ? (
                    <div className='mx-auto text-center pb-5'>
                      <p>
                        <a
                          href={`https://teleport.org/cities/${selectedFavorite.urbanArea.slug}`}
                          target='_blank'
                          rel='noreferrer noopener'
                          className='hover:no-underline'>
                          <button
                            className={`bg-${colorTheme} text-${theme} font-bold py-3 px-6 rounded-full capitalize`}>
                            Explore life in {selectedFavorite.urbanArea.name}
                          </button>
                        </a>
                      </p>
                      <p
                        className={`py-1 text-xs italic font-light text-${colorTheme}`}>
                        Powered by&nbsp;
                        <a
                          href='https://teleport.org/'
                          target='_blank'
                          rel='noreferrer noopener'
                          className={`hover:no-underline hover:font-medium hover:text-${colorTheme}`}>
                          Teleport
                        </a>
                      </p>
                    </div>
                  ) : null}
                </div>
              </Fragment>
            ) : null}
          </div>
        </div>
      ) : null}
    </Fragment>
  )
}

export default FavoritesContainer