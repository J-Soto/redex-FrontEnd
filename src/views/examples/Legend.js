
import React, { useRef, useEffect, useState, useCallback } from 'react';
import PlaneImage1 from '../../assets/img/icons/common/airplane-mode.png'
import PlaneImage2 from '../../assets/img/icons/common/airplane-mode3.png'
import PlaneImage3 from '../../assets/img/icons/common/airplane-mode4.png'







const Legend = () => {   
   
    return(
        <div style={{border: "2px solid"}}>
            <p style= {{display: "flex", justifyContent: "center", fontSize: "18px", fontWeight: "500"}} >Leyenda</p>

            <div style={{display: "flex", justifyContent:"space-evenly"}}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <img width="25" height="25" src={PlaneImage1} alt="Avion verde" />
                    <p>Capacidad empleada hasta un 20%</p>
                </div>   
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <img width="25" height="25" src={PlaneImage2} alt="Avion amarillo" />
                    <p>Capacidad empleada hasta un 60%</p>
                </div>  
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <img width="25" height="25" src={PlaneImage3} alt="Avion rojo" />
                    <p>Capacidad empleada más de 60%</p>
                </div>         
            </div>

            
           
        </div>
    )
}



export default Legend