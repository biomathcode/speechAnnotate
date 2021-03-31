import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import SpectroPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';

import { WaveformContianer, Wave, PlayButton, Timeline, AudioContainer } from './styles';

import audiofile from './../audio/110.wav'
import {PropTypes} from 'prop-types';

class AudioSpectrum extends Component {
    static randomColor = (gradient = 0.5) =>
        `
    rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256,
        )}, ${gradient})

    `
    state = {
        playing: false,
        regions: this.props.regions,
        zoom: 0,
        cursorTime: 0,
        url: this.props.url

    }
    componentDidMount() {
        const track = document.querySelector('#track');
        this.waveform = WaveSurfer.create({
            barWidth: 5,
            cursorWidth: 1,
            container: '#waveform',
            backend: 'WebAudio',
            height: 80,
            progressColor: '#2D5BFF',
            responsive: true,
            hideScrollbar: false,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
            plugins: [
                MinimapPlugin.create(),
                RegionsPlugin.create({
                    regionsMinLength: 0.1,
            regions: this.state.regions,
            dragSelection: {
                slop: 0.1,
                resize:true
            }
                }),
                TimelinePlugin.create({
                    container: '#timeline'
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
        this.waveform.load(track);
        this.waveform.on('ready', function () {
            this.waveform.enableDragSelection({
                color: AudioSpectrum.randomColor(0.1)
            })
        })
        this.waveform.on('region-click', function(region, e) {
            e.stopPropagation();
            // Play on click, loop on shift click
            e.shiftKey ? region.playLoop() : region.play();

            console.log(region)
        });
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
            start: 0,
            end: 0.2,
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

    render() {

        return (
            <>
            <AudioContainer>

                <PlayButton onClick={this.handlePlayPause}>
                    {
                        !this.state.playing ? 'Play' : 'Pause'
                    }
                </PlayButton>

                <button onClick={this.addRegion}>
                    Add a new region
                </button>
                <button onClick={this.gettingAnnotations}>
                    Annotations
                </button>
                <button onClick={this.removeAll}>
                    Remove all
                </button>
                <WaveformContianer>
                    <Wave id="waveform" />
                    <audio id="track" src={audiofile} />
                </WaveformContianer>
                <Timeline id="timeline" />
                <div id="Spectograph" />
            </AudioContainer>

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