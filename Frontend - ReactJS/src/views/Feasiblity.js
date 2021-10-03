import React, {useState} from 'react'
import { connect } from 'react-redux'
import Tick from '../assets/images/tick.svg'
import Fail from '../assets/images/fail.svg'
import '../assets/css/Feasiblity.css'
import { Link } from 'react-router-dom';
import SAC from '../assets/images/nasasac.png'

function Feasiblity({ feaData }) {

    return (
        <div className="bg">
        <img src={SAC} className="sac" alt="SAC" />
            <Link to="/">
                <div className="backArrow">
                    &#8668; Back
                </div>
            </Link>
            {feaData && (
                <div className="center">
                    {feaData.status === "success" ?
                        <>
                            <img src={Tick} alt="tick"  className="fea__expression"/>
                            {feaData.rate === "1" ? 
                                <div className="fea__text">
                                    Bingo, you can play GTA V for an entire year with the power you will be generating for 3 months.<br/><span style={{ lineHeight: "90px", fontSize: "calc(1.4vh + 1.4vw)" }}>It is Feasible!</span>
                                </div>
                                : 
                                    <div className="fea__text">
                                        You have the capacity to give a thundershock stronger than Pikachu!<br/><span style={{ lineHeight: "90px", fontSize: "calc(1.4vh + 1.4vw)" }}>It is Highly Feasible!</span>
                                    </div>
                            }
                        </>
                        :
                        <>
                            <img src={Fail} alt="tick"  className="fea__expression"/>
                            <div className="fea__text">
                                Oops, you have only enough sunshine over your rooftop to light a bulb for 1 year.
                            </div>
                        </>
                    }
                    
                    <div className="fea__amount" style={ feaData.status !== "success" ? { color: "#F24E1E" } : {}}>
                        <div className="fea__amount__value">~{Math.round(feaData.amount*10)/10}</div>
                        <div className="fea__amount__unit">&nbsp;K.Watts/year</div>
                    </div>
                    <div className="fea__disclaimer">
                        for a Solar Panel of 4 K.Watts
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        feaData: state.feaData
    }
}

export default connect(mapStateToProps, null)(Feasiblity);
