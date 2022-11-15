import React, { useState, useEffect } from 'react';
import { ReactComponent as ClockIcon } from './../../assets/img/icons/common/clock.svg';

function ClockTime({setCurrentTime,startDate}) {
    const [dateState, setDateState] = useState(startDate);
    setCurrentTime(dateState);

    useEffect(() => {
        // console.log(dateState.getDate())
        // console.log(startDate.getDate()+4)
        if(dateState.getDate() < startDate.getDate()+4){
            setInterval(() => setDateState(new Date(dateState.setMinutes(dateState.getMinutes()+10))), 1500);
            setCurrentTime(dateState);
        }
        
    }, []);

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <ClockIcon style={{marginTop: "0", marginBottom: "1rem", width: "20px", height: "20px"}}/>
            <p style={{marginLeft:"10px", fontWeight: "500", fontSize: "18px"}}>
             {dateState.toLocaleString('es-PE', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            })}
            </p>
        </div>
    );
}

export default ClockTime;