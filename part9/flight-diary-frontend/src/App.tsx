import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

type Visibility = 'great' | 'good' | 'ok' | 'poor';

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
};

interface ValidationError {
  message: string;
  errors: Record<string, string[]>
};

const style = {
  color: 'red',
};


const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState({
    date: '',
    weather: '',
    visibility: '',
    comment: '',
  });
  const [notify, setNotify] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const response = await axios.get<DiaryEntry[]>('http://localhost:3000/api/diaries');
        setDiaries(response.data);
      } catch (error) {
        console.error('Error fetching diaries:', error);
      }
    })();
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    try {
      const response = await axios.post<DiaryEntry>('http://localhost:3000/api/diaries', newDiary);
      setDiaries(diaries.concat(response.data));
      setNewDiary({
        date: '',
        weather: '', 
        visibility: '', 
        comment: ''
      });
    } catch (error: unknown) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        const data = String(error.response?.data);
        const dataWithProcess = data.replace('Something went wrong.', '');
        setNotify(dataWithProcess);
        setTimeout(() => setNotify(''), 5000);
      } else {
        const data = String(error);
        const dataWithProcess = data.replace('Something went wrong.', '');
        setNotify(dataWithProcess);
        setTimeout(() => setNotify(''), 5000);
      }
    }
  };

  return (
    <div>
      <h3>Add new entry</h3>
      {notify && <div style={style}>{notify}</div>}
      <form onSubmit={(event) => {
        event.preventDefault();
        void diaryCreation(event); 
      }}>
        date<input 
          type='date' 
          value={newDiary.date} 
          onChange={(event) => setNewDiary({ ...newDiary, date: event.target.value }) }
          /> 
        <br />
        visibility &nbsp;
        great<input 
          type='radio' 
          name='visibility' 
          checked={newDiary.visibility === 'great'}
          onChange={() => setNewDiary({ ...newDiary, visibility: 'great' as Visibility }) } 
          />
        good<input 
          type='radio' 
          name='visibility' 
          checked={newDiary.visibility === 'good'}
          onChange={() => setNewDiary({ ...newDiary, visibility: 'good' as Visibility }) } 
          />
        ok<input 
          type='radio' 
          name='visibility' 
          checked={newDiary.visibility === 'ok'}
          onChange={() => setNewDiary({ ...newDiary, visibility: 'ok' as Visibility }) } 
          />
        poor<input 
          type='radio' 
          name='visibility' 
          checked={newDiary.visibility === 'poor'}
          onChange={() => setNewDiary({ ...newDiary, visibility: 'poor' as Visibility }) } 
          />
        <br />
        weather &nbsp;
        sunny<input 
          type='radio' 
          name='weather' 
          checked={newDiary.weather === 'sunny'}
          onChange={() => setNewDiary({ ...newDiary, weather: 'sunny' as Weather }) } 
          />
        rainy<input 
          type='radio' 
          name='weather'
          checked={newDiary.weather === 'rainy'}
          onChange={() => setNewDiary({ ...newDiary, weather: 'rainy' as Weather }) } 
          />
        cloudy<input 
          type='radio' 
          name='weather'
          checked={newDiary.weather === 'cloudy'}
          onChange={() => setNewDiary({ ...newDiary, weather: 'cloudy' as Weather }) } 
          />
        stormy<input 
          type='radio' 
          name='weather'
          checked={newDiary.weather === 'stormy'}
          onChange={() => setNewDiary({ ...newDiary, weather: 'stormy' as Weather }) } 
          />
        windy<input 
          type='radio' 
          name='weather'
          checked={newDiary.weather === 'windy'}
          onChange={() => setNewDiary({ ...newDiary, weather: 'windy' as Weather }) } 
          />
        <br />
        comment<input 
          value={newDiary.comment} 
          onChange={(event) => setNewDiary({ ...newDiary, comment: event.target.value }) }
          /> 
        <br />
        <button type='submit'>add</button>
      </form>

      <h3>Diary entries</h3>
      <>
        {diaries.map((diary: DiaryEntry) => (
          <div key={diary.id}>
            <h4>{diary.date}</h4>
            <p>visibility: {diary.visibility} <br />
              weather: {diary.weather} <br />
              {diary.comment && <>comment: {diary.comment}</>}
            </p>
          </div>
        ))}
      </>
    </div>
  );
};

export default App;