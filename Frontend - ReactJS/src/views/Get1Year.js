import React, { useState } from 'react'
import '../assets/css/GetYear.css'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import SAC from '../assets/images/nasasac.png'

function Get1Year({ year, lat, lng, wattage, setNASAData, setUserData }) {

    const [userIp, setUserIp] = useState({
        "01": "",
        "02": "",
        "03": "",
        "04": "",
        "05": "",
        "06": "",
        "07": "",
        "08": "",
        "09": "",
        "10": "",
        "11": "",
        "12": ""
    })

    const submit = () => {
        document.getElementsByClassName("spinner_load")[0].style.display = "flex"
        Axios
            .get(`http://127.0.0.1:5000/last1year/${lat}/${lng}/${year}/${wattage}`)
            .then(res => {
                setNASAData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        setUserData(userIp);
        document.getElementsByClassName("button")[0].click();
    }


    return (
        <div className="bg">
        <img src={SAC} className="sac" alt="SAC" />
            <Link to="/">
                <div className="backArrow">
                    &#8668; Back
                </div>
            </Link>
            <div className="spinner_load">
                <ClipLoader color={"#ffffff"} loading={true} size={100} />
            </div>
            <Link to="/analysis"><button className="button" style={{ display: "none" }}></button></Link>
            <div className="get1">
                <div className="get1__header">
                    1 Year Analysis for the year {year}
                </div>
                <div className="get1__userIp__disc">
                    Enter your panel values in K.Watts
                </div>
                <div className="get1__userIp">
                    <div className="get1__userIp__side">
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                01/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["01"]}
                                onChange={(e) => setUserIp({ ...userIp, "01": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                02/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["02"]}
                                onChange={(e) => setUserIp({ ...userIp, "02": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                03/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["03"]}
                                onChange={(e) => setUserIp({ ...userIp, "03": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                04/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["04"]}
                                onChange={(e) => setUserIp({ ...userIp, "04": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                05/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["05"]}
                                onChange={(e) => setUserIp({ ...userIp, "05": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                06/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["06"]}
                                onChange={(e) => setUserIp({ ...userIp, "06": e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="get1__userIp__side">
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                07/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["07"]}
                                onChange={(e) => setUserIp({ ...userIp, "07": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                08/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["08"]}
                                onChange={(e) => setUserIp({ ...userIp, "08": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                09/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["09"]}
                                onChange={(e) => setUserIp({ ...userIp, "09": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                10/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["10"]}
                                onChange={(e) => setUserIp({ ...userIp, "10": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                11/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["11"]}
                                onChange={(e) => setUserIp({ ...userIp, "11": e.target.value })}
                            />
                        </div>
                        <div className="get_userIp__box">
                            <div className="get_userIp__box__left">
                                12/{year}
                            </div>
                            <input
                                className="get_userIp__box__right"
                                type="number"
                                value={userIp["12"]}
                                onChange={(e) => setUserIp({ ...userIp, "12": e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <button className="get1__button" onClick={submit}>
                    Generate
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        year: state.basic_perf.year,
        lat: state.basic_perf.location.latitude,
        lng: state.basic_perf.location.longitude,
        wattage: state.basic_perf.personal.wattage,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserData: (data) => dispatch({ type: "SET_ANA_USER_DATA", data: data }),
        setNASAData: (data) => dispatch({ type: "SET_ANA_NASA_DATA", data: data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Get1Year);
