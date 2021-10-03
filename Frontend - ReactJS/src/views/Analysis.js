import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Link } from 'react-router-dom';
import '../assets/css/common.css';

function Analysis({ year, analysis_user_data, analysis_NASA_data }) {

    const [options, setOptions] = useState({})

    const makeList = () => {
        console.log(analysis_user_data)
        let NASA_data = analysis_NASA_data.data.map(item => item/1000)
        let user_data = []
        let time = []
        for (let i = 1; i <= 12; i++) {
            let t = i
            if (i < 10) {
                t = '0' + i   
            }
            time.push(t + "/" + year)
            user_data.push(parseFloat(analysis_user_data[t]))
        }
        console.log(user_data)
        var data = {
            "NASA": NASA_data,
            "user": user_data,
            "time": time
        }
        console.log(data)

        setOptions({
            chart: {
                backgroundColor: 'transparent',
                height: 0.93*window.innerHeight,
                width: 0.96*window.innerWidth,
                type: "spline",
                styledMode: true,
            },
            title: {
                text: ''
            },

            

            yAxis: {
                gridLineColor: 'transparent',
                lineColor: '#ffffff',
                lineWidth: 1,
                title: {
                    enabled: false
                },
                labels: {
                    style: {
                        color: '#ffff'
                    }
                }
            },

            xAxis: {
                categories: data.time,
                color: '#ffffff',
                lineColor: '#ffffff',
                lineWidth: 1,
                labels: {
                    style: {
                        color: '#ffff'
                    }
                }
                
            },

            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 80,
                y: 20,
                floating: true,
                itemStyle: {
                    color: '#ffffff',
                    fontSize:'18px'
                }
                
            },

            plotOptions: {
                series: {
                    shadow: true,
                    label: {
                        connectorAllowed: false
                    },

                }
            },

            series: [{
                color: '#fc3d21',
                className : "nasa_data",
                name: 'NASA Data',
                data: data.NASA,
                lineWidth: 2,
                jitter: {
					y: 0.0001
				}
            }, {
                color: '#4086fb',
                className: "user_data",
                name: 'Panel Data',
                data: data.user,
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            },
            credits: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    if(this.series.name === "Panel Data"){
                        return `
                        <b>Solar Panel Data</b></br>
                        <b>${this.x}:</b> ${this.y}
                    `;
                    }else{
                        return `
                        <b>${this.series.name}</b></br>
                        <b>${this.x}:</b> ${Highcharts.numberFormat(this.y, 2)}
                    `;
                    }
                    
                }
                    
            },

        })

    }

    useEffect(() => {
        if (analysis_NASA_data && analysis_user_data && year) {
            makeList()
            window.addEventListener('resize', makeList)
        }
    }, [analysis_user_data, analysis_NASA_data, year])

    return (
        <div className="bg">
            <Link to="/">
                <div className="backArrow">
                    &#8668; Back
                </div>
            </Link>
            <div className='highchart' id="highchart" style={{ padding: "30px", position:"relative" }}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        year: state.basic_perf.year,
        analysis_user_data: state.analysis_user_data,
        analysis_NASA_data: state.analysis_NASA_data,
    }
}

export default connect(mapStateToProps)(Analysis)
