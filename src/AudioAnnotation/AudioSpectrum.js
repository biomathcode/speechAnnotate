import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import SpectroPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';

import { WaveformContianer, Wave, PlayButton, Timeline, AudioContainer } from './styles';


import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";



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
        table: this.props.filedata.table,
        index: this.props.filedata.index,
        serial: this.props.filedata.serial,
        regions: [],
        responseMessage: 'Send to server',
        start: 0.1,
        end: 0.5,
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

        const primaryLableInterval = (pxPerSec) => {
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

        const secondaryLabelInterval = (pxPerSec) => {
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

        const randomColor =(gradient= 0.5) => (
            `
        rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
                Math.random() * 256,
            )}, ${gradient})
    
        `
    )
    this.waveform.on('ready', function () {
        this.waveform.enableDragSelection({
            color: randomColor()
        })
    })

        //remove the regions on double click

        // this.waveform.on('region-in', function(region, e) {
        //     region.data = "this is the new data"
        //     console.log(region.data)
        // })
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

    componentDidUpdate() {
        // plays only the sound under the region
        this.waveform.on('region-click', function (region, e) {
            e.stopPropagation();
            // Play on click, loop on shift click
            e.shiftKey ? region.playLoop() : region.play();
        });

        this.waveform.on('region-mouseenter', showNote);
        function showNote(region) {
            if (!showNote.el) {
                showNote.el = document.querySelector('#subtitle');
            }
            showNote.el.textContent = region.data || '–';
        }

        this.waveform.on('region-click', editAnnotation)
        function editAnnotation(region) {
            let form = document.forms.edit;
            form.style.opacity = 1;
            form.elements.note.value = region.data || '';
            form.onsubmit = function (e) {
                e.preventDefault();
                region.update({
                    data: form.elements.note.value
                });
                form.style.opacity = 0;
                let regionElement = document.querySelectorAll('region')
                regionElement.forEach(el => {
                    if(el.getAttribute('data-id') === region.id) {
                        let label = '<li class="region-label">'+ region.data + '</li>'
                        return el.insertAdjacentHTML('beforeend', label)
                    } 
                })
            };
            form.onreset = function () {
                form.style.opacity = 0;
                form.dataset.region = null;
            };
            form.dataset.region = region.id;
        }
        this.waveform.on('region-dblclick', function (region, e) {
            region.remove()
        })

        this.waveform.on('region-updated', function (region, e) {
            // console.log(region.data,e)
            // if (region.data === {} ) {
            //     return 
            // } else {
            //     const regionofInterest = document.querySelector('region')
            //     console.log(regionofInterest.dataset.id)
            //     if (regionofInterest.dataset.id === region.id) {
            //         var node = document.createElement("li");
            //         node.textContent = region.data
            //         regionofInterest.appendChild(node)
            //     }

            // }
            
            if(typeof(region.data) === 'string'){

                // if (regionElement[0].getAttribute('data-id') === region.id) {

                //         }  
                //         console.log(region)
            }
            // if(region.data ) {
            //     

            // }
            
        })
    }
    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
        this.waveform.playPause();
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

    removeAll = () => {
        this.waveform.clearRegions()
    }

    //ToDo url 
    downloadFile = async () => {
        const regionsList = []
        const regions = Object.values(this.waveform.regions.list)
            .map(region => {
                const json = {
                    start: region.start,
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

        const blob = new Blob([json], { type: 'application/json' });

        const href = await URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    sendingFile = () => {
        //sending post request at http://xn--11by0j.com:8000/api/v1/response_srt_web/
        this.setState({responseMessage : 'sending...'})
        const folder = String(this.state.table) + "/" + String(this.state.index) + "/" + this.state.serial

        const regionsList = []
        const regions = Object.values(this.waveform.regions.list)
            .map(region => {
                const json = {
                    start: region.start,
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
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                data
            )
        };
        fetch('http://xn--11by0j.com:8000/api/v1/response_srt_web/', requestOptions)
            .then(res => {
                res.text()
            })
            
        this.setState({responseMessage: 'DONE!!!!!!'})
    }

    render() {
        


        return (
            <>
                
                <p id="subtitle" className="">&nbsp;</p>
                <AudioContainer>
                    <button onClick={this.removeAll}>
                        Remove all
                    </button>
                    <button onClick={this.downloadFile}>download</button>
                    <button onClick={this.sendingFile}>{this.state.responseMessage}</button>
                    <WaveformContianer>
                        <Wave id="waveform" />
                        <audio id="track" src={this.state.url} onLoadedMetadata={event => { this.setState({ duration: event.target.duration }) }} />
                    </WaveformContianer>

                    {/* <div id="Spectograph" /> */}
                </AudioContainer>
                <div className="labelForm" >
                <PlayButton onClick={this.handlePlayPause}>
                    {
                        !this.state.playing ? 'Play' : 'Pause'
                    }
                </PlayButton>
                    <form name="edit" style={{ opacity: 0, transition: 'opacity 300ms linear', margin: '10px 0' }}>
                        <div className="form-group">
                            <label htmlFor="note">Note</label>
                            <ReactTransliterate value={this.state.label} onChange={(e) => this.setState({ label: e.target.value })} id="note" className="form-control" rows="3" name="note" />
                        </div>
                        <button type="submit" className="btn btn-success btn-block">Save</button>

                    </form>
                </div>
                {/* <img src={Image} height="300px" width="100%" alt="spectrograph" /> */}
                <img src={this.state.spectogram} height="300px" width="100%" alt="newdata" />

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