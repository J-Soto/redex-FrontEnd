import React, { useState, useEffect } from 'react';
import { ReactComponent as ClockIcon } from './../../assets/img/icons/common/clock.svg';

function ClockTime({setCurrentTime,startDate,endDate,bandera}) {
    const [dateState, setDateState] = useState(startDate);
    setCurrentTime(dateState);

    useEffect(() => {
        if(dateState.getDate() < endDate.getDate()){
            setInterval(() => (dateState.getDate() < endDate.getDate()+1 && bandera) ? setDateState(new Date(dateState.setMinutes(dateState.getMinutes()+10))) : "", 1500);
            setCurrentTime(dateState);
        }
        
    }, [bandera]);

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