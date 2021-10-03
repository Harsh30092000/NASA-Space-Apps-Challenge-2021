import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import '../assets/css/common.css'
import '../assets/css/GetData.css'
import DummyMap from '../assets/images/dummy_map.png'
import { connect } from 'react-redux'
import Axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import SAC from '../assets/images/nasasac.png'

export class GetLocation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // lat: "13.0604",
            // lng: "80.2244"
            lat: null,
            lng: null,
        };
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.submit = this.submit.bind(this);
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
            lat: Math.round(position.coords.latitude * 10000) / 10000,
            lng: Math.round(position.coords.longitude * 10000) / 10000
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

    submit() {
        
        document.getElementsByClassName("spinner_load")[0].style.display = "flex"
        Axios
            .get(`http://127.0.0.1:5000/${this.state.lat}/${this.state.lng}`)
            .then(res => {
                console.log(res.data);
                this.props.setDatas(res.data);
                console.log("sent");
                document.getElementsByClassName("button")[0].click();
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        console.log(this.state.lat);
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
                <Link to="/feasiblity"><button className="button" style={{ display: "none" }}></button></Link>
                <div className="center">
                    <div style={{ display: "flex" }} >
                        {this.state.lat && this.state.lng ?
                            <div className="map">
                                <img src={`https://maps.googleapis.com/maps/api/staticmap?center=
            ${this.state.lat},${this.state.lng}&zoom=17&size=1504x500&sensor=false&markers=color:red%7C${this.state.lat},${this.state.lng}&key=API_KEY`} alt="map" className="getData__map" />
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
                        <div className="getLoc__form">
                            <div className="getLoc__form__name">
                                Latitude
                            </div>
                            <input
                                type="text"
                                className="getLoc__form__input"
                                value={this.state.lat}
                                onChange={(e) => this.setState({ lat: e.target.value })}
                            />
                            <div className="getLoc__form__name" style={{ marginTop: "5vh" }}>
                                Longitude
                            </div>
                            <input
                                type="text"
                                className="getLoc__form__input"
                                value={this.state.lng}
                                onChange={(e) => this.setState({ lng: e.target.value })}
                            />
                            <button
                                className="getData__submit"
                                onClick={this.submit}
                            >
                                Calculate
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDatas: (data) => dispatch({ type: "SET_FEA_DATA", data: data })
    }
}

export default connect(null, mapDispatchToProps)(GetLocation);
