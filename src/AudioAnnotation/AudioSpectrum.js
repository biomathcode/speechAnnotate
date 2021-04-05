import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import SpectroPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';

import { WaveformContianer, Wave, PlayButton, Timeline, AudioContainer } from './styles';
import Image from './../audio/1/1/110.png'

import audiofile from './../audio/1/1/110.wav'





class AudioSpectrum extends Component {
    static randomColor = (gradient = 0.5) =>
        `
    rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256,
        )}, ${gradient})

    `
    state = {
        playing: false,
        zoom: 0,
        cursorTime: 0,
        url: this.props.url,
        spectogram: this.props.spectogram,
        table:this.props.filedata.table,
        index: this.props.filedata.index,
        serial: this.props.filedata.serial,
        start: 0,
        end: 1,
        label: '',
        duration: 0,
    }
    componentDidMount() {
        
        const track = document.querySelector('#track');

        const formatTimeCallback = (seconds, pxPerSec) => {
            seconds = Number(seconds)
            var minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;

            // fill up seconds with zeroes
            var secondsStr = Math.round(seconds).toString();
            if (pxPerSec >= 25 * 10) {
                secondsStr = seconds.toFixed(2);
            } else if (pxPerSec >= 25 * 1) {
                secondsStr = seconds.toFixed(1);
            }

            if (minutes > 0) {
                if (seconds < 10) {
                    secondsStr = '0' + secondsStr;
                }
                return `${minutes}:${secondsStr}`;
            }
            return secondsStr;
        }

        const timeInterval = (pxPerSec) => {
            var retval = 1;
            if (pxPerSec >= 25 * 100) {
                retval = 0.01;
            } else if (pxPerSec >= 25 * 40) {
                retval = 0.025;
            } else if (pxPerSec >= 25 * 10) {
                retval = 0.1;
            } else if (pxPerSec >= 25 * 4) {
                retval = 0.25;
            } else if (pxPerSec >= 25) {
                retval = 1;
            } else if (pxPerSec * 5 >= 25) {
                retval = 5;
            } else if (pxPerSec * 15 >= 25) {
                retval = 15;
            } else {
                retval = Math.ceil(0.5 / pxPerSec) * 60;
            }
            return retval;
        }

    const primaryLableInterval =(pxPerSec) => {
        var retval = 1;
    if (pxPerSec >= 25 * 100) {
        retval = 10;
    } else if (pxPerSec >= 25 * 40) {
        retval = 4;
    } else if (pxPerSec >= 25 * 10) {
        retval = 10;
    } else if (pxPerSec >= 25 * 4) {
        retval = 4;
    } else if (pxPerSec >= 25) {
        retval = 1;
    } else if (pxPerSec * 5 >= 25) {
        retval = 5;
    } else if (pxPerSec * 15 >= 25) {
        retval = 15;
    } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
    }

    const secondaryLabelInterval =(pxPerSec) => {
        // draw one every 10s as an example
    return Math.floor(10 / timeInterval(pxPerSec));
    }



        this.waveform = WaveSurfer.create({
            barWidth: 5,
            barRadius: 3,
            barGap: 3,
            cursorWidth: 1,
            container: '#waveform',
            waveColor: '#D9DCFF',
            backend: 'WebAudio',
            height: 80,
            progressColor: '#2D5BFF',
            responsive: true,
            hideScrollbar: false,
            cursorColor: '#4353FF',
            plugins: [
                MinimapPlugin.create(),
                RegionsPlugin.create({
                    regions: this.state.regions,
                    dragSelection: {
                        slop: 0.1,
                        resize: true
                    }
                }),
                TimelinePlugin.create({
                    container: '#timeline',
                    formatTimeCallback: formatTimeCallback,
                    timeInterval: timeInterval,
                    primaryLableInterval: primaryLableInterval, 
                    secondaryLabelInterval: secondaryLabelInterval, 
                    primaryColor: 'blue',
                    secondaryColor: 'red',
                    primaryFontColor: 'blue',
                    secondaryFontColor: 'red'
                }),
                CursorPlugin.create({
                    showTime: true,
                    opacity: 1,
                    customShowTimeStyle: {
                        'background-color': '#000',
                        color: '#fff',
                        padding: '2px',
                        'font-size': '10px'
                    }
                }),
                SpectroPlugin.create({
                    container: "#Spectograph"
                })
            ]
        })
        //getting the element it and loading the url
        this.waveform.load(track);
        this.waveform.on('ready', function () {
            this.waveform.enableDragSelection({
                color: AudioSpectrum.randomColor(0.1)
            })

        })
        // plays only the sound under the region
        this.waveform.on('region-click', function (region, e) {
            e.stopPropagation();
            // Play on click, loop on shift click
            e.shiftKey ? region.playLoop() : region.play();
        });
        //remove the regions on double click
        this.waveform.on('region-dblclick', function(region, e) {
            region.remove()
        })
        // wavesurfer.on('region-click', editAnnotation);
        // wavesurfer.on('region-updated', saveRegions);
        // wavesurfer.on('region-removed', saveRegions);
        // wavesurfer.on('region-in', showNote);

        // wavesurfer.on('region-play', function(region) {
        //     region.once('out', function() {
        //         wavesurfer.play(region.start);
        //         wavesurfer.pause();
        //     });
        // });

    }
    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
        this.waveform.playPause();
        console.log(this.waveform.regions.list)
    };

    //adding regions to play
    addRegion = () => {
        this.waveform.addRegion({
            start: this.state.start,
            end: this.state.end,
            data: this.state.label,
            color: AudioSpectrum.randomColor(),
        })
    }
    gettingAnnotations = () => {
        return (
            console.log(
                this.waveform.regions.list
            )
        )
    }
    removeAll = () => {
        this.waveform.clearRegions()
    }
    zoom = () => {

    }
    //ToDo url 
    downloadFile = async () => {
        const regionsList = []
        const regions = Object.values(this.waveform.regions.list)
            .map(region => {
              const json = {
                  start : region.start,
                  end: region.end,
                  label: region.data
              }
              return regionsList.push(json)
            })
        const fileName = "file";
        const fileinfo = {
            duration: this.state.duration,
            url: this.state.url,
            regions: regionsList
        }
        const json = JSON.stringify(fileinfo)
            console.log(regionsList, fileinfo)
            const blob = new Blob([json],{type:'application/json'});
            console.log(blob)
            const href = await URL.createObjectURL(blob);
            console.log(href)
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    }

    sendingFile = () => {
        //sending post request at http://xn--11by0j.com:8000/api/v1/response_srt_web/
        const folder =  String(this.state.table)+ "/" + String(this.state.index) + "/" + this.state.serial
        console.log(folder)
        const regionsList = []
        const regions = Object.values(this.waveform.regions.list)
            .map(region => {
              const json = {
                  start : region.start,
                  end: region.end,
                  label: region.data
              }
              return regionsList.push(json)
            })
        const data = {
            folder: folder,
            duration: this.state.duration,
            regions: regions
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify(
                data
            )
        };
        fetch('http://xn--11by0j.com:8000/api/v1/response_srt_web/', requestOptions)
        .then(res =>{
            res.json()
        })
        .then(data => console.log(data))
    }

    render() {
    
        return (
            <>
                <AudioContainer>

                    <PlayButton onClick={this.handlePlayPause}>
                        {
                            !this.state.playing ? 'Play' : 'Pause'
                        }
                    </PlayButton>
                    <button onClick={this.gettingAnnotations}>
                        Annotations
                    </button>
                    <button onClick={this.removeAll}>
                        Remove all
                    </button>
                    <button onClick={this.downloadFile}>download</button>
                    <button onClick={this.sendingFile}>Sending to server</button>
                    <input type="range" id="slider" onInput={(event) => console.log(event) } />
                    <WaveformContianer>
                        <Wave id="waveform" />
                        <audio id="track" src={this.state.url} onLoadedMetadata = {event => {this.setState({duration: event.target.duration})}} />
                    </WaveformContianer>

                    {/* <div id="Spectograph" /> */}
                </AudioContainer>
                <div className="labelForm">
                    <div className="labelcontainer">
                    <div  className="inputLabel ">
                    <label htmlFor="start">Start</label>
                    <input value={this.state.start} step={0.1} onChange={(e) => this.setState({ start: e.target.value })} placeholder="start" type="number" />
                    </div>
                    <div  className="inputLabel ">
                    <label htmlFor="end">End</label>
                    <input value={this.state.end} step={0.1} onChange={(e) => this.setState({ end: e.target.value })} placeholder="end" type="number" />
                    </div>
                    <div  className="inputLabel ">
                    <label htmlFor="label">Label</label>
                    <input value={this.state.label} onChange={(e) => this.setState({ label: e.target.value })} placeholder="label" type="string" />
                    </div>
                    </div>
                    
                    <button onClick={this.addRegion}>
                        Add a new region
                </button>
                </div>

                {/* <img src={Image} height="300px" width="100%" alt="spectrograph" /> */}
                <img src={this.state.spectogram} height="300px" width="100%" alt="newdata"/>
                
                <Timeline id="timeline" />

        

                
            </>

        );
    }
}

// AudioSpectrum.propTypes = {
//     url : PropTypes.string,
//     regions: PropTypes.arrayOf(
//         PropTypes.shape({
//           id: PropTypes.string.isRequired,
//           start: PropTypes.string.isRequired,
//           end: PropTypes.number.isRequired,
//           color: PropTypes.string.isRequired
//         }).isRequired
//       ).isRequired

// }
export default AudioSpectrum;