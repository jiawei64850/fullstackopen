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
        })
        .catch(error => {
          console.error('Error fetching country info:', error)
          return axios.get()
        })
    } else if (match.length > 10 && value !== null) {
      console.log('value is', value);
      setReminder('Too many matches, specify another filter') 
      if (value === null) setReminder('')
      setName('')
      setCapital('')
      setArea('')
      setLanguages([])
      setFlag('')
    } else {
      setReminder('')
      setName('')
      setCapital('')
      setArea('')
      setLanguages([])
      setFlag('')
    }
  }, [value, countryName])

  const handleChange = (event) => {
    setValue(event.target.value)
  }
  const showTheInfo = (item) => {
    console.log(item)
    const selectedCountry = item.country
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
      setMatchCountryList([])
    })
    .catch(error => {
      console.error('Error fetching country info:', error)
    })
  }

  return (
    <div>
      <OnSearch value={value} handleChange={handleChange} />
      <pre >
        < >
        {matchCountryList.length < 10 && matchCountryList.length > 1 && (
          <ul>
            {matchCountryList.map((country, index) => (
              <li key={index}>{country}
              <button type='button' onClick={() => {showTheInfo({country})}}>show</button>
              </li>
            ))}
          </ul>
          
        )}
        
        </>

        {reminder && <p>{reminder}</p>}
        <h1>{name}</h1>
        {capital && <p>capital {capital}</p>}
        {area && <p>area {area}</p>}
        {languages.length > 0 && (
          <div>
            <h2>Languages:</h2>
            <ul>
              {languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
          </div>
        )}
      </pre><br></br>
      {flag && <img src={flag} alt="flag" width="100" />}
    </div>
  )
}

export default App