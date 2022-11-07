import React, { useState, useEffect } from 'react';
import { ReactComponent as ClockIcon } from './../../assets/img/icons/common/clock.svg';

function ClockTime({setCurrentTime}) {
    const [dateState, setDateState] = useState(new Date());
    setCurrentTime(dateState);

    useEffect(() => {
        setInterval(() => setDateState(new Date(dateState.setMinutes(dateState.getMinutes()+10))), 1500);
        setCurrentTime(dateState);
    }, []);

    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <ClockIcon style={{marginTop: "0", marginBottom: "1rem", width: "20px", height: "20px"}}/>
            <p style={{marginLeft:"10px", fontWeight: "500", fontSize: "18px"}}>
             {dateState.toLocaleString('es-PE', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            })}
            </p>
        </div>
    );
}

export default ClockTime;