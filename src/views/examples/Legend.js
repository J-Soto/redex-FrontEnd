
import React, { useRef, useEffect, useState, useCallback } from 'react';
import PlaneImage1 from '../../assets/img/icons/common/airplane-mode.png'
import PlaneImage2 from '../../assets/img/icons/common/airplane-mode3.png'
import PlaneImage3 from '../../assets/img/icons/common/airplane-mode4.png'
import AirportImage1 from '../../assets/img/icons/common/Airport_blue.png'
import AirportImage2 from '../../assets/img/icons/common/Airport_purple.png'
import AirportImage3 from '../../assets/img/icons/common/Airport_green2.png'
import AirportImage4 from '../../assets/img/icons/common/Airport_yellow.png'
import AirportImage5 from '../../assets/img/icons/common/Airport_red.png'


const Legend = ({tipo}) => {   
   
    return(
        <div style={{border: "2px solid"}}>
            <p style= {{display: "flex", justifyContent: "center", fontSize: "18px", fontWeight: "500"}} >Leyenda</p>

            <div style={{display: "flex", justifyContent:"space-evenly"}}>

                {tipo === 1 ?
                    <>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <img width="25" height="25" src={PlaneImage1} alt="Avion verde" />
                            <img width="25" height="25" src={AirportImage3} alt="Almacen verde" style={{marginTop: "10px"}} />
                            <p>Capacidad empleada hasta un 20%</p>
                        </div>   
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <img width="25" height="25" src={PlaneImage2} alt="Avion amarillo" style={{marginTop: "10px"}} />
                            <img width="25" height="25" src={AirportImage4} alt="Almacen amarillo" />
                            <p>Capacidad empleada hasta un 60%</p>
                        </div>  
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <img width="25" height="25" src={PlaneImage3} alt="Avion rojo" style={{marginTop: "10px"}} />
                            <img width="25" height="25" src={AirportImage5} alt="Almacen rojo" />
                            <p>Capacidad empleada más de 60%</p>
                        </div>     
                    </>
                    :
                    <>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <img width="25" height="25" src={AirportImage1} alt="Almacen gris" />
                            <p>Aeropuertos de América</p>
                        </div>   
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <img width="25" height="25" src={AirportImage2} alt="Almacen marron" />
                            <p>Aeropuertos de Europa</p>
                        </div>  
                    </>
                }
                 

            </div>

            
           
        </div>
    )
}



export default Legend