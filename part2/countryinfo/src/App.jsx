import { useState, useEffect } from 'react'
import axios from 'axios'

const OnSearch = ({ value, handleChange }) => {
  return (
    <>
      find countries
      <input value={value} onChange={handleChange} />
    </>
  )
}

const Layout = ({ text }) => {
  return <> {text} </>
}

const App = () => {
  const [countryName, setCountryName] = useState([])
  const [value, setValue] = useState('')
  const [name, setName] = useState(null)
  const [reminder, setReminder] = useState('')
  const [languages, setLanguages] = useState([])
  const [capital, setCapital] = useState('')
  const [area, setArea] = useState('')
  const [flag, setFlag] = useState('')
  const [matchCountryList, setMatchCountryList] = useState([])
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [temperature, setTemperature] = useState('')
  const [windSpeed, setWindSpeed] = useState('')
  const [weatherIcon, setWeatherIcon] = useState('')

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const countryNames = response.data.map(country => country.name.common)
        setCountryName(countryNames)
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
      })
  }, [])

  useEffect(() => {
    let match = []
    if (value) {
      match = countryName.filter(country =>
        country.toLowerCase().includes(value.toLowerCase())
      )
    }
    setMatchCountryList(match)
    
    if (match.length === 1) {
      const selectedCountry = match[0]
      console.log('fetching info for', selectedCountry)
      fetchData(selectedCountry)
    } else if (match.length > 10 && value !== null) {
      emptyTheValue()
      setReminder('Too many matches, specify another filter') 
    } else {
      emptyTheValue()
    }
  }, [value, countryName])

  const fetchData = (selectedCountry) => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${selectedCountry}`)
    .then(response => {
      const countryData = response.data
      setReminder('')
      setName(countryData.name.common)
      setCapital(countryData.capital[0])
      setArea(countryData.area)
      setLanguages(Object.values(countryData.languages))
      setFlag(countryData.flags.svg)
      setLat(countryData.latlng[0])
      setLng(countryData.latlng[1])
      return {lat, lng}
    })
    .then(({lat, lng}) => {
      return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=83805fd299f365b63571755d09e3f9a7`)
    })
    .then(response => {
      const weatherData = response.data
      setTemperature(weatherData.main.temp)
      setWindSpeed(weatherData.wind.speed)
      setWeatherIcon(weatherData.weather[0].icon)
    })
    .catch(error => {
      console.error('Error fetching country info:', error)         
    })

  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const showTheInfo = (item) => {
    const selectedCountry = item.country
    fetchData(selectedCountry)
    setMatchCountryList([])
  }

  const emptyTheValue = () => {
    setReminder('')
    setName('')
    setCapital('')
    setArea('')
    setLanguages([])
    setFlag('')
    setTemperature('')
    setWeatherIcon('')
    setWindSpeed('')
  }
  return (
    <div>
      <OnSearch value={value} handleChange={handleChange} />
      {matchCountryList.length < 10 && matchCountryList.length > 1 && (
          <ul>
            {matchCountryList.map((country, index) => (
              <li key={index}>{country}
              <button type='button' onClick={() => {showTheInfo({country})}}>show</button>
              </li>
            ))}
          </ul>
        )}
        {reminder && <p>{reminder}</p>}
        <h1>{name}</h1>
        {capital && <>capital {capital}</>}
        <br></br>
        {area && <>area {area}</>}
        {languages.length > 0 && (
          <div>
            <h4>Language:</h4>
            <ul>
              {languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
          </div>
        )}
      {flag && <img src={flag} alt="flag" width="200" />}
      {temperature && <h2>Weather in {capital}</h2>}
      {temperature && <p>temperature {temperature} Celcius</p>}
      {weatherIcon && <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt="weather" width="120"/>}
      {windSpeed && <p>wind {windSpeed} m/s</p>}
    </div>
  )
}

export default App