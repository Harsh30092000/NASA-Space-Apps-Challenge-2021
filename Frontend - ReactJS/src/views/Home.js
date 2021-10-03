import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { Link } from 'react-router-dom';
import '../assets/css/Home.css';
import '../assets/css/common.css';
import Earth from '../components/Earth';
import SAC from '../assets/images/nasasac.png'
import Hawks from '../assets/images/team_hawks.png'


function Home() {

    return (
        <div className="bg">
        <img src={SAC} className="sac" alt="SAC" />
            <div className="left">
                <div className="center">
                    <div className="home__left__title">
                        <div className="home__left__title__top">
                            Team Hawks
                            {/* <img src={Hawks} className="hawks" alt="Hawks" /> */}
                        </div>
                        <div className="home__left__title__bottom">
                            You are my sunshine!
                        </div>
                    </div>
                    <div className="home__left__buttons">
                        {/* <Link to="/get-location">
                            <button className="home__left__button">
                                Check Solar Panel Feasablity
                            </button>
                        </Link>
                        <Link to="/get-data">
                            <button className="home__left__button">
                                Power you can Genrate
                            </button>
                        </Link>
                        <Link to="/visualizer">
                            <button className="home__left__button">
                                Solar Irradiance Visualizer
                            </button>
                        </Link> */}
                        <div style={{ display: "flex", justifyContent:"center" }}>
                            <Link to="/get-location">
                                <button className="home__left__button">
                                    Check Solar Panel Feasablity
                                </button>
                            </Link>
                            <Link to="/get-data">
                                <button className="home__left__button">
                                    Solar Panel Power Predictor
                                </button>
                            </Link>
                        </div>
                        <div style={{ display: "flex", justifyContent:"center" }}>
                            <Link to="/visualizer">
                                <button className="home__left__button">
                                    Solar Irradiance Visualizer
                                </button>
                            </Link>
                            <Link to="/get-performance">
                                <button className="home__left__button">
                                    Compare Solar Panel Efficiency
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <Link to="/visualizer">
                    <Canvas>
                        <Suspense fallback={null}>
                            <Earth zoomRotate={false} />
                        </Suspense>
                    </Canvas>
                </Link>
            </div>
        </div>
    )
}

export default Home
