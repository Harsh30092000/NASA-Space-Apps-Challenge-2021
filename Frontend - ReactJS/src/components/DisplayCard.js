import React from 'react'

function DisplayCard({ type, data, number }) {

    console.log(data) 
    return (
        <div className="card" style={number === 2 ? {marginRight: 0} : {}}>
            <div className="card__title">
                {type === "daily" ? "D" : (type === "monthly" ? "M" : "Y")}+{number}
            </div>
            <div className="card__time">
                {data !== null ? 
                    type === "daily" ? 
                        (`${data[0].slice(6,8)}/${data[0].slice(4,6)}/${data[0].slice(0,4)}`)
                        : (type === "monthly" ? 
                            (`${data[0].slice(4,6)}/${data[0].slice(0,4)}`)
                            : ((number === 0 ? 
                                (new Date().getMonth() + 1) 
                                : "01")+`/${data[0].slice(0,4)} - 12/${data[0].slice(0,4)}`))
                    : "No Data"}
            </div>
            <div
                className="card__content"
                style={type === "yearly" ? {marginTop: "35px"} : {}}
            >
            {/* "20211004" */}
                <div
                    className="card__content__value"
                    style={type === "yearly" ? {fontSize: "calc(3vh + 3vw)"} : (type === "monthly" ? {fontSize: "calc(3.4vh + 3.4vw)"} : {})}
                >
                    {data && Math.round(data[1] * 10) / 10}
                </div>
                {" "}&nbsp;
                <div
                    className="card__content__unit"
                    style={type === "yearly" ? {fontSize: "calc(1.2vh + 1.2vw)"} : (type === "monthly" ? {fontSize: "calc(1.3vh + 1.3vw)"} : {})}
                >
                    K.Watts
                </div>
            </div>
        </div>
    )
}

export default DisplayCard
