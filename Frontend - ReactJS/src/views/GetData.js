import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../assets/css/common.css'
import '../assets/css/GetData.css'
import DummyMap from '../assets/images/dummy_map.png'
import { connect } from 'react-redux'
import Axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import SAC from '../assets/images/nasasac.png'


export class GetData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // lat: "13.0604",
            // lng: "80.2244"
            lat: null,
            lng: null,
            wattage: "",
            area: "",
            efficiency: ""
        };
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.wattageClick = this.wattageClick.bind(this);
        this.efficiencyClick = this.efficiencyClick.bind(this);
        this.yesClick = this.yesClick.bind(this);
        this.noClick = this.noClick.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        } else {
            alert("Geolocation is not supported by this browser");
        }
    }

    getCoordinates(position) {
        console.log("Location " + position.coords.latitude + " " + position.coords.longitude);
        this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }

    handleLocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location unavailable")
                break;
            case error.TIMEOUT:
                alert("Request timeout")
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error")
                break;
            default:
                alert("An unknown error")
        }
    }

    yesClick() {
        document.getElementsByClassName("getData__userInput__questionPart")[0].style.display = "none";
        document.getElementsByClassName("getData__userInput__yesPart")[0].style.display = "block";
    }
    noClick() {
        document.getElementsByClassName("getData__userInput__questionPart")[0].style.display = "none";
        document.getElementsByClassName("getData__userInput__noPart")[0].style.display = "block";
    }


    wattageClick() {
        document.getElementsByClassName("spinner_load")[0].style.display = "flex"
        var d = new Date();
        Axios
            .get(`http://127.0.0.1:5000/wattage/${this.state.lat}/${this.state.lng}/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${this.state.wattage * 1000}`)
            .then(res => {
                this.props.setDatas(res.data);
                console.log("sent");
                document.getElementsByClassName("button")[0].click();
            })
            .catch(err => {
                console.log(err);
            })

    }
    efficiencyClick() {
        document.getElementsByClassName("spinner_load")[0].style.display = "flex"
        var d = new Date();
        Axios
            .get(`http://127.0.0.1:5000/efficiency/${this.state.lat}/${this.state.lng}/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${this.state.area}/${this.state.efficiency}`)
            .then(res => {
                this.props.setDatas(res.data);
                console.log("sent");
                document.getElementsByClassName("button")[0].click();
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <div className="bg">
                <Link to="/">
                    <div className="backArrow">
                        &#8668; Back
                    </div>
                </Link>
                
        <img src={SAC} className="sac" alt="SAC" />
                <div className="spinner_load">
                    <ClipLoader color={"#ffffff"} loading={true} size={100} />
                </div>

                <Link to="/power"><button className="button" style={{ display: "none" }}></button></Link>
                <div className="left">
                    <div className="center">
                        {this.state.lat && this.state.lng ?
                            <div className="map">
                                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=
          ${this.state.lat},${this.state.lng}&zoom=17&size=1204x500&sensor=false&markers=color:red%7C${this.state.lat},${this.state.lng}&key=API_KEY`} alt="map" className="getData__map" />
                            </div>
                            :
                            <div className="map">
                                <div className="getData__map__dummy">
                                    <button
                                        className="getData__map__dummy__button"
                                        onClick={this.getLocation}
                                    >
                                        <i className="fa fa-map-marker"></i> Detect My Location Automatically
                                    </button>
                                </div>
                                <img src={DummyMap} alt="map" className="getData__map" />
                            </div>
                        }
                    </div>
                </div>
                <div className="right">
                    <div className="center">
                        <div className="getData__latlong">
                            <div className="getData__latlong__title">
                                <div>Latitude</div>
                            </div>
                            <input type="number" className="getData__latlong__input" value={this.state.lat} onChange={(e) => { this.setState({ lat: e.target.value }) }} />
                            <div
                                className="getData__latlong__title"
                                style={{ marginLeft: '2vw' }}
                            >
                                <div>Longitude</div>
                            </div>
                            <input type="number" className="getData__latlong__input" value={this.state.lng} onChange={(e) => { this.setState({ lng: e.target.value }) }} />
                        </div>
                        <div className="getData__userInput">
                            <div className="getData__userInput__questionPart">
                                <div className="getData__userInput__question">
                                    Do you know what is the wattage of your Solar Panel?
                                </div>
                                <button
                                    className="getData__userInput__button__yes"
                                    onClick={this.yesClick}
                                >
                                    Yes
                                </button>
                                <button
                                    className="getData__userInput__button__no"
                                    onClick={this.noClick}
                                >
                                    No
                                </button>
                            </div>
                            <div className="getData__userInput__yesPart">
                                <div className="getData__userInput__question1">
                                    Wattage of your Solar Panel?
                                </div>
                                <div className="getData__userInput__answer">
                                    <input type="number" className="getData__userInput__answer__input" value={this.state.wattage} onChange={(e) => { this.setState({ wattage: e.target.value }) }} />
                                    <span className="getData__userInput__answer__unit">k.Watts</span>
                                </div>
                                <button
                                    className="getData__submit"
                                    onClick={this.wattageClick}
                                >
                                    Calculate
                                </button>
                            </div>
                            <div className="getData__userInput__noPart">
                                <div className="getData__userInput__question1">
                                    Area of your Solar Panel
                                </div>
                                <div className="getData__userInput__answer">
                                    <input type="number" className="getData__userInput__answer__input" value={this.state.area} onChange={(e) => { this.setState({ area: e.target.value }) }} />
                                    <div className="getData__userInput__answer__unit">sq.m</div>
                                </div>
                                <div className="getData__userInput__question1" style={{ marginTop: "3vw" }}>
                                    Efficiency of your Solar Panel
                                </div>
                                <div className="getData__userInput__answer">
                                    <input type="number" className="getData__userInput__answer__input" value={this.state.efficiency} onChange={(e) => { this.setState({ efficiency: e.target.value }) }} />
                                    <div className="getData__userInput__answer__unit">%</div>
                                </div>
                                <button
                                    className="getData__submit"
                                    onClick={this.efficiencyClick}
                                >
                                    Calculate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDatas: (data) => dispatch({ type: "SET_DATA", data: data })
    }
}

export default connect(null, mapDispatchToProps)(GetData);
