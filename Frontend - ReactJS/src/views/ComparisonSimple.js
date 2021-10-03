import React, { useState } from 'react'
import My from '../assets/images/my.svg'
import NASA from '../assets/images/NASA.png'
import '../assets/css/ComparisonSimple.css'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SAC from '../assets/images/nasasac.png'

function ComparisonSimple({ data }) {

    return (
        <div className="bg">
        <img src={SAC} className="sac" alt="SAC" />
            {data && <div className="comp__container">
                <div className="comp__boxes">
                    <div className="comp__box">
                        <div className="comp__box__top">
                            <div className="comp__box__logo1">
                                <img src={My} alt="my" />
                            </div>
                            <div className="comp__box__year">
                                <div>{"month" in data ? "Month Year" : "Year"}</div>
                                {"month" in data ? (
                                    <div>{data.month}/{data.year}</div>
                                ) : (
                                    <div>{data.year}</div>
                                )
                                }
                            </div>
                        </div>
                        <div className="comp__box__bottom">
                            <div className="comp__box__bottom__item">
                                <div className="comp__box__bottom__item__title">
                                    Panel Wattage
                                </div>
                                <div className="comp__box__bottom__item__value">
                                    {Math.round(data.personal.wattage * 100)/100} K.Watts
                                </div>
                            </div>
                            <div className="comp__box__bottom__item">
                                <div className="comp__box__bottom__item__title">
                                    Annual Power
                                </div>
                                <div className="comp__box__bottom__item__value">
                                    {Math.round(data.personal.power * 100)/100} K.Watts
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comp__box">
                        <div className="comp__box__top">
                            <div className="comp__box__logo">
                                <img src={NASA} alt="NASA" />
                            </div>
                            <div className="comp__box__year">
                                <div>{(Math.abs(Math.round(data.location.latitude * 100) / 100))}° {data.location.latitude < 0 ? "S" : "N"}</div>
                                <div>{(Math.abs(Math.round(data.location.longitude * 100) / 100))}° {data.location.longitude < 0 ? "W" : "E"}</div>
                            </div>
                        </div>
                        <div className="comp__box__bottom">
                            <div className="comp__box__bottom__item">
                                <div className="comp__box__bottom__item__title">
                                    Solar Irradiance
                                </div>
                                <div className="comp__box__bottom__item__value">
                                    {Math.round(data.NASA.irradiance*100)/100} K.W/m<sup>2</sup>
                                </div>
                            </div>
                            <div className="comp__box__bottom__item">
                                <div className="comp__box__bottom__item__title">
                                    Annual Power
                                </div>
                                <div className="comp__box__bottom__item__value">
                                    {Math.round(data.NASA.power*100)/100} K.Watts
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comp__comment">
                    {data.comment}!
                </div>
                <div className="comp__buttons">
                    <Link to="/get-1-year">
                        <button className="comp__button1">
                            Perform 1 year Analysis
                        </button>
                    </Link>
                    <Link to="/">
                        <button className="comp__button2">
                            Go Back to Home Page
                        </button>
                    </Link>
                </div>
            </div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state.basic_perf
    }
}

export default connect(mapStateToProps)(ComparisonSimple)
