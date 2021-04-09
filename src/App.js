import React, { useEffect, useState } from 'react';
import AudioSpectrum from './AudioAnnotation/AudioSpectrum';

import './App.css'



function App() {
  const [url, setUrl] = useState('')
  const [spectogram, setSpectogram] = useState('')
  const [filedata, setFiledata] = useState({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://xn--11by0j.com:8000/api/v1/get_data")
    .then(
      res => res.json()
    ).then(result => {
      console.log(result)
      setUrl(result.sound_url)
      setSpectogram(result.spectogram_url)
      setFiledata({
        table: result.table,
        index: result.index,
        serial: result.serial
      })
      setLoading(false)
    },)
  },[url])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="App"> 
    <button type="button" onClick={handleRefresh}>refresh</button>
    {!loading?
    <AudioSpectrum url={url} spectogram={spectogram} filedata={filedata} />: null  
  }
    
    </div>
  );
}

export default App;
