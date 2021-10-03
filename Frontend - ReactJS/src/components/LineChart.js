import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import React, { useEffect, useState } from 'react';
import '../assets/css/Linechart.css'
import { connect } from 'react-redux'


function Charts({ keys, values, type, temp }) {


    const [options, setOptions] = useState({})

    const makeList = () => {
        var categories = []
        for (var i = 0; i < keys.length; i++) {
            var category = keys[i]
            console.log(category, values[i]);
            if (type === "daily") {
                categories.push(category.substr(0, 2) + "/" + category.substr(2, 2))
            } else if (type === "monthly") {
                categories.push(category.substr(4, 2) + "/" + category.substr(0, 4))
            } else {
                categories.push(category)
            }
        }
        var x = [].concat(categories).reverse()
        var y = [].concat(values).reverse()

        setOptions({
            chart: {
                backgroundColor: 'transparent',
                height: 0.4 * window.innerHeight,
                width: 0.6 * window.innerWidth,
                type: "area"
            },
            title: {
                style: {
                    color: 'transparent'
                }
            },
            xAxis: {
                pointStart: 0,
                categories: x,
                gridLineColor: 'transparent',
                lineColor: '#ffffff',
                lineWidth: 1,
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                }
            },
            yAxis: {
                min: 0,
                lineColor: '#ffffff',
                lineWidth: 1,
                title: {
                    enabled: false
                },
                labels: {
                    enabled: true,
                    style: {
                        color: '#ffffff'
                    },
                },
                gridLineColor: 'transparent',


            },
            plotOptions: {
                area: {
                    pointStart: 0,
                    color: '#f77c0380',
                    lineColor: '#ffffff',
                    lineWidth: 4
                },
                marker: {
                    enabled: false
                }
            },
            series: [{
                showInLegend: false,
                data: y,
            }],
            tooltip: {
                formatter: function (){
                    return `
                        <b>${this.x}:</b> ${Highcharts.numberFormat(this.y, 2)}
                    `;
                }

            },
            credits: {
                enabled: false
            }

        })

    }

    useEffect(() => {
        if (keys && values) {
            makeList()
            window.addEventListener('resize', makeList)
        }
    }, [keys, values, temp])

    return (
        <div className='highchart'>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        temp: state.temp,
    }
}

export default connect(mapStateToProps)(Charts);
