import React, { useState, useEffect } from 'react'
import LineChart from '../components/LineChart'
import DisplayCard from './../components/DisplayCard';
import '../assets/css/Power.css'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SAC from '../assets/images/nasasac.png'

function Power({ APIdata, temp, setTemp }) {

    const [type, setType] = useState("daily");
    const [data, setData] = useState();
    const [data2, setData2] = useState({
        key: null,
        value: null
    });


    useEffect(() => {
        if (APIdata) {
            if (temp === true) {
                if (type === "yearly") {
                    var arr = [];
                    for (const i in APIdata.temperature.next3years) {
                        arr.push([i, APIdata.temperature.next3years[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.temperature.chart.yearly.keys,
                        value: APIdata.temperature.chart.yearly.values
                    });
                } else if (type === "monthly") {
                    // eslint-disable-next-line no-redeclare
                    var arr = [];
                    for (const i in APIdata.temperature.next3months) {
                        arr.push([i, APIdata.temperature.next3months[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.temperature.chart.monthly.keys,
                        value: APIdata.temperature.chart.monthly.values
                    });
                } else {
                    console.log("Hi");
                    // eslint-disable-next-line no-redeclare
                    var arr = [];
                    for (const i in APIdata.temperature.next3days) {
                        arr.push([i, APIdata.temperature.next3days[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.temperature.chart.daily.keys,
                        value: APIdata.temperature.chart.daily.values
                    });
                }
            } else {
                if (type === "yearly") {
                    var arr = [];
                    for (const i in APIdata.power.next3years) {
                        arr.push([i, APIdata.power.next3years[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.power.chart.yearly.keys,
                        value: APIdata.power.chart.yearly.values
                    });
                } else if (type === "monthly") {
                    // eslint-disable-next-line no-redeclare
                    var arr = [];
                    for (const i in APIdata.power.next3months) {
                        arr.push([i, APIdata.power.next3months[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.power.chart.monthly.keys,
                        value: APIdata.power.chart.monthly.values
                    });
                } else {
                    console.log("Hi");
                    // eslint-disable-next-line no-redeclare
                    var arr = [];
                    for (const i in APIdata.power.next3days) {
                        arr.push([i, APIdata.power.next3days[i]]);
                    }
                    setData(arr);
                    setData2({
                        key: APIdata.power.chart.daily.keys,
                        value: APIdata.power.chart.daily.values
                    });
                }
            }

        }
    }, [APIdata, type, temp])

    // useEffect(() => {
    //     if (temp) {
    //         document.getElementsByClassName("power__info__tempBox__checkbox")[0].checked = true;
    //     } else {
    //         document.getElementsByClassName("power__info__tempBox__checkbox")[0].checked = false;
    //     }
    // }, [temp])

    useEffect(() => {
        console.log(temp);
    }, [temp])

    const handleChange = (e) => {
        if (e.target.checked) {
            setTemp(true);
        } else {
            setTemp(false);
        }
    }

    return (
        <div className="bg" style={{ flexDirection: "column" }}>
        <img src={SAC} className="sac" alt="SAC" />
            <div className="top">

                <div className="power__highchart">
                    <LineChart keys={data2.key} values={data2.value} type={type} />
                </div>
                <div className="power__info">
                    <Link to="/">
                        <div className="backArrow1">
                            &#8668; Back
                        </div>
                    </Link>
                    <div className="power__info__location">
                        13.00° N, 80.21° E
                    </div>
                    <div className="power__info__tempBox">
                        <input type="checkbox" className="power__info__tempBox__checkbox" onChange={handleChange} />
                        Take temperature readings into consideration
                    </div>
                    {/* <div className="power__info__comment">
                        Wow! You Solar Panel generates very good power.
                    </div> */}
                </div>
            </div>
            <div className="bottom">
                <div className="power__options1">
                    <button
                        className="power__options__button"
                        style={type === "daily" ? { color: "#fff", backgroundColor: "#f77c03" } : { color: "#f77c03", backgroundColor: "transparent" }}
                        onClick={() => setType("daily")}
                    >
                        Daily
                    </button><br />
                    <button
                        className="power__options__button"
                        style={type === "monthly" ? { color: "#fff", backgroundColor: "#f77c03" } : { color: "#f77c03", backgroundColor: "transparent" }}
                        onClick={() => setType("monthly")}
                    >
                        Monthly
                    </button><br />
                    <button
                        className="power__options__button"
                        style={type === "yearly" ? { color: "#fff", backgroundColor: "#f77c03" } : { color: "#f77c03", backgroundColor: "transparent" }}
                        onClick={() => setType("yearly")}
                    >
                        Yearly
                    </button>
                </div>
                <div className="power__options">
                    <DisplayCard type={type} data={data ? data[0] : null} number={0} />
                </div>
                <div className="power__options">
                    <DisplayCard type={type} data={data ? data[1] : null} number={1} />
                </div>
                <div className="power__options">
                    <DisplayCard type={type} data={data ? data[2] : null} number={2} />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        APIdata: state.data,
        temp: state.temp
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTemp: (status) => dispatch({ type: "TOGGLE_TEMP", status: status })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Power)
