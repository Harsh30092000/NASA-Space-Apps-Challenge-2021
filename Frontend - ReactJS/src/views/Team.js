/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import KD from '../assets/images/KD.png'
import HP from '../assets/images/HP.jpeg'
import AN from '../assets/images/AN.jpeg'
import MD from '../assets/images/MD.jpeg'
import RA from '../assets/images/RA.jpg'

function Team() {
    return (
        <div className="bg" style={{ display: "block" }}>
        <div className="container1">
            <div className="card1">
                <div className="imgBx">
                    <img
                        src={RA}
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="contentBx">
                        <h3>Abhishek R</h3>
                    </div>
                    <ul className="sci">
                        <li style={{"--i": "1"}}>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        </li>
                        <li style={{"--i": "2"}}>
                        <a href="https://github.com/abishekr007"><i className="fa fa-github"></i></a>
                        </li>
                        <li style={{"--i": "3"}}>
                        <a href="https://www.linkedin.com/in/abishek-r/"><i className="fa fa-linkedin"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card1">
                <div className="imgBx">
                    <img
                        src={KD}
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="contentBx">
                        <h3>Keerthivasan D </h3>
                    </div>
                    <ul className="sci">
                        <li style={{"--i": "1"}}>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        </li>
                        <li style={{"--i": "2"}}>
                        <a href="https://github.com/kd100100"><i className="fa fa-github"></i></a>
                        </li>
                        <li style={{"--i": "3"}}>
                        <a href="https://www.linkedin.com/in/keerthivasand/"><i className="fa fa-linkedin"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card1">
                <div className="imgBx">
                    <img
                        src={HP}
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="contentBx">
                        <h3>Harshith P </h3>
                    </div>
                    <ul className="sci">
                        <li style={{"--i": "1"}}>
                        <a href="#"><i className="fa fa-instagram"></i></a>
                        </li>
                        <li style={{"--i": "2"}}>
                        <a href="https://github.com/Harsh30092000"><i className="fa fa-github"></i></a>
                        </li>
                        <li style={{"--i": "3"}}>
                        <a href="https://www.linkedin.com/in/harshith30/"><i className="fa fa-linkedin"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
            <div className="container1">
                <div className="card1">
                    <div className="imgBx">
                        <img
                            src={AN}
                            alt=""
                        />
                    </div>
                    <div className="content">
                        <div className="contentBx">
                            <h3>N Aravind</h3>
                        </div>
                        <ul className="sci">
                            <li style={{"--i": "1"}}>
                            <a href="#"><i className="fa fa-instagram"></i></a>
                            </li>
                            <li style={{"--i": "2"}}>
                            <a href="https://github.com/aravindnar"><i className="fa fa-github"></i></a>
                            </li>
                            <li style={{"--i": "3"}}>
                            <a href="https://www.linkedin.com/in/aravindnar/"><i className="fa fa-linkedin"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="card1">
                    <div className="imgBx">
                        <img
                            src={MD}
                            alt=""
                        />
                    </div>
                    <div className="content">
                        <div className="contentBx">
                            <h3>Manoah D</h3>
                        </div>
                        <ul className="sci">
                            <li style={{"--i": "1"}}>
                            <a href="#"><i className="fa fa-instagram"></i></a>
                            </li>
                            <li style={{"--i": "2"}}>
                            <a href="https://github.com/Manoah-3401"><i className="fa fa-github"></i></a>
                            </li>
                            <li style={{"--i": "3"}}>
                            <a href="https://www.linkedin.com/in/manoahd/"><i className="fa fa-linkedin"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="card1">
                    <div className="imgBx">
                        <img
                            src={KD}
                            alt=""
                        />
                    </div>
                    <div className="content">
                        <div className="contentBx">
                            <h3>Akshit Gaur</h3>
                        </div>
                        <ul className="sci">
                            <li style={{"--i": "1"}}>
                            <a href="#"><i className="fa fa-instagram"></i></a>
                            </li>
                            <li style={{"--i": "2"}}>
                            <a href="#"><i className="fa fa-github"></i></a>
                            </li>
                            <li style={{"--i": "3"}}>
                            <a href="#"><i className="fa fa-linkedin"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Team
