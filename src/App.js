import React, { useEffect, useState } from 'react';
import AudioSpectrum from './AudioAnnotation/AudioSpectrum';

import './App.css'
import {axiosInstance} from './Api/axiosInstance'



function App() {
  const [url, setUrl] = useState('')
  const [spectogram, setSpectogram] = useState('')
  const [filedata, setFiledata] = useState({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("get_data")
    .then(result => {
      const data = result.data
      setUrl(data.sound_url)
      setSpectogram(data.spectogram_url)
      setFiledata({
        table: data.table,
        index: data.index,
        serial: data.serial
      })
      setLoading(false)
    },)
  },[])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="App"> 
    <button type="button" onClick={handleRefresh}>Load next</button>
    {!loading?
    <AudioSpectrum url={url} spectogram={spectogram} filedata={filedata} />: null  
  }
    
    </div>
  );
}

export default App;
