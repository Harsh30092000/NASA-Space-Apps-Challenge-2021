import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import '../assets/css/common.css';
import '../assets/css/Visualizer.css';
import Earth from '../components/Earth';
import { Link } from 'react-router-dom';
import SAC from '../assets/images/nasasac.png'

function Visualizer() {
    return (
        <div className="bg">
        <img src={SAC} className="sac" alt="SAC" />
            <Link to="/">
                <div className="backArrow">
                    &#8668; Back
                </div>
            </Link>
            <div className="left">
                <Canvas>
                    <Suspense fallback={null}>
                        <Earth zoomRotate={true} />
                    </Suspense>
                </Canvas>
            </div>
            <div className="right">
                <div className="center">
                    <div className="visualizer__title">
                        Annual Solar Irradiance
                    </div>
                    <div className="visualizer__para">
                        The annual solar irradiance is the average amount of energy that is emitted by the sun in a year.
                        This 3D interactive globe represents the average annual solar irradiance of the past 20 years.
                    </div>
                    <div className="visualizer__legend">
                        <div className="visualizer__legend__title">
                            Annual Average (kWh/m2)
                        </div>
                        <div className="visualizer__legend__item__row">
                            <div className="visualizer__legend__item">
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#930002" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    2500
                                </span>
                            </div>
                            <div
                                className="visualizer__legend__item"
                                style={{ flex: 1 }}
                            >
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#CD700A" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    1500
                                </span>
                            </div>
                            <div className="visualizer__legend__item">
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#CEB975" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    500
                                </span>
                            </div>
                        </div>
                        <div className="visualizer__legend__item__row">
                            <div className="visualizer__legend__item">
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#D12008" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    2000
                                </span>
                            </div>
                            <div
                                className="visualizer__legend__item"
                                style={{ flex: 1 }}
                            >
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#CF9F19" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    1000
                                </span>
                            </div>
                            <div className="visualizer__legend__item">
                                <span
                                    className="visualizer__legend__item__color"
                                    style={{ backgroundColor: "#002765", marginRight: "18px" }}
                                />
                                <span className="visualizer__legend__item__text">
                                    Sea
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Visualizer
