import React, { useState } from 'react';
import AudioSpectrum from './AudioAnnotation/AudioSpectrum';
import InputColor from 'react-input-color';
import Editor from './components/Editor'


const randomHsl = () => `hsla(' + (Math.floor(Math.random()*360) + ', 100%, 70%, 1)`


function App() {
  const [color, setColor] = useState({})
  const [regions, setRegions] = useState([
    {start: 0.1, end: 0.2, color: 'red'}
  ])
  const [start, setStart] = useState(0)

  const [end, setEnd] = useState(0)

  const handleDelte = (e) => {
    return (
      <div>
        
      </div>
    )
  }
  const handleSubmit = (e) => {
    const newRegion = {
      start: start,
      end: end,
      color: color.hex
    }
    e.preventDefault()
    console.log(color.hex)
    setRegions([...regions, newRegion])
  }

  return (
    <div className="App">
      {/* <Editor /> */}
      <form onSubmit={handleSubmit}>
        <input type="number" value={start} onChange={(e) =>setStart(e.target.value)} placeholder="start"  />
        <input type="number" value={end} onChange= {(e) => setEnd(e.target.value)} placeholder="end" />
        <InputColor
        initialValue="#5e72e4"
        onChange={setColor}
        placement="right"
      />
        <button type="submit">Add</button>
      </form>
      <div>
      {regions.map(region => {
        return (
          <div key={region.color}>
            <div> Start : {region.start} </div>
            <div> END   : {region.end} </div>
            <div> COLOR :{region.color} </div>
            {/* <button type="button" onClick={}>Delete</button> */}
          </div>
        )
      })}

      </div>
      
      <AudioSpectrum regions={regions} />
    </div>
  );
}

export default App;
