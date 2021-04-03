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
        start: 0,
        end: 1,
        label: '',
        color: '',
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

    render() {
        const newurl = 'https://speech-ml-data.s3.amazonaws.com/hindi_pahada_new/2/9/books_read.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2KYUGO7PXK47QE7Z%2F20210403%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210403T180433Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c1cb50d55084d1ecb4059db4660e6ba16ca98e8add919db53acd3b0fa397bfb4'
        const url = 'https://speech-ml-data.s3.amazonaws.com/hindi_pahada_new/2/3/books_read.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2KYUGO7PXK47QE7Z%2F20210403%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210403T175925Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=33517957f52bf5a31964dad52046bd36dbd3cf72131882c3bc001f908a8db1ce'
        const spectrograph = 'https://speech-ml-data.s3.amazonaws.com/hindi_pahada_new/2/test/4_spectogram.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2KYUGO7PXK47QE7Z%2F20210403%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210403T191227Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=004df671e3dd0048b34b02ea9c037a3b50d7a90be0c928c7831699d7daa29192'
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
                    <input type="range" id="slider" onInput={(event) => console.log(event) } />
                    <WaveformContianer>
                        <Wave id="waveform" />
                        <audio id="track" src={audiofile} onLoadedMetadata = {event => {this.setState({duration: event.target.duration})}} />
                    </WaveformContianer>

                    {/* <div id="Spectograph" /> */}
                </AudioContainer>
                <div className="LableInput">
                    <input value={this.state.start} step={0.1} onChange={(e) => this.setState({ start: e.target.value })} placeholder="start" type="number" />
                    <input value={this.state.end} step={0.1} onChange={(e) => this.setState({ end: e.target.value })} placeholder="end" type="number" />
                    <input value={this.state.color} onChange={(e) => this.setState({ color: e.target.value })} placeholder="color" type="string" />
                    <input value={this.state.label} onChange={(e) => this.setState({ label: e.target.value })} placeholder="label" type="string" />
                    <button onClick={this.addRegion}>
                        Add a new region
                </button>
                </div>

                {/* <img src={Image} height="300px" width="100%" alt="spectrograph" /> */}
                <img src={spectrograph} height="300px" width="100%" alt="newdata"/>
                
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