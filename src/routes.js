/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Airport from "views/examples/Airport.js";
import Shipment from "views/examples/Shipments/Shipment.js";
import ShipmentStep1 from "views/examples/Shipments/AddShipmentStep1.js";
import ShipmentStep2 from "views/examples/Shipments/AddShipmentStep2.js";
import ShipmentStep3 from "views/examples/Shipments/AddShipmentStep3.js";
import ShipmentStep4 from "views/examples/Shipments/AddShipmentStep4.js";
import Client from "views/examples/Client.js";
import Construction from "views/examples/Construction.js";
import Simulation from "views/examples/Simulation.js";
import Flight from "views/examples/Flight.js";
import ShipmentIn from "views/examples/Shipments/ShipmentIn.js";
import ShippingMonitoring from "views/examples/Monitoring.js";
import ShipmentSA from "views/examples/Shipments/ShipmentSA.js";
import Warehouse from "views/examples/Warehouse.js";
import WarehouseIn from "views/examples/WarehouseIn.js";
//siguen roles de bd:0->todos 1->admin  2->superadmin
var routes = [
  {
    path: "/index",
    name: "Inicio",
    icon: "fas fa-home text-gray-dark",
    component: Index,
    layout: "/admin",
    side: true,
    role: 0,
  },

  {
    path: "/shipmentsAll",
    name: "Envíos",
    icon: "ni ni-send text-gray-dark",
    component: ShipmentSA,
    layout: "/admin",
    side: true,
    role: 2,
  },

  {
    path: "/flights",
    name: "Vuelos",
    icon: "fas fa-ticket-alt text-gray-dark",
    component: Flight,
    layout: "/admin",
    side: true,
    role: 2,
  },
  {
    path: "/airports",
    name: "Aeropuertos",
    icon: "fas fa-plane text-gray-dark",
    component: Airport,
    layout: "/admin",
    side: true,
    role: 2,
  },
  {
    path: "/simulation",
    name: "Simulación",
    icon: "fas fa-file-alt text-gray-dark",
    component: Simulation,
    layout: "/admin",
    side: true,
    role: 2,
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-gray-dark",
    component: Login,
    layout: "/auth",
    side: false,
    role: 0,
  },

  {
    path: "/shipmentsOut",
    name: "Envíos de salida",
    icon: "ni ni-send text-gray-dark",
    component: Shipment,
    layout: "/admin",
    side: true,
    role: 1,
  },
  {
    path: "/shipmentsIn",
    name: "Envíos de entrada",
    icon: "fas fa-inbox text-gray-dark",
    component: ShipmentIn,
    layout: "/admin",
    side: true,
    role: 1,
  },

  {
    path: "/clients",
    name: "Clientes",
    icon: "ni ni-single-02 text-gray-dark",
    component: Client,
    layout: "/admin",
    side: true,
    role: 1,
  },
  {
    path: "/warehouse",
    name: "Almacén de salida",
    icon: "ni ni-bag-17 text-gray-dark",
    component: Warehouse,
    layout: "/admin",
    side: true,
    role: 1,
  },

  {
    path: "/warehouseIn",
    name: "Almacén de entrada",
    icon: "ni ni-bag-17 text-gray-dark",
    component: WarehouseIn,
    layout: "/admin",
    side: true,
    role: 1,
  },

  {
    path: "/monitoring",
    name: "Monitoreo de envíos",
    icon: "fa fa-chart-pie text-gray-dark",
    component: ShippingMonitoring,
    layout: "/admin",
    side: true,
    role: 2,
  },
  
  {
    path: "/addShipmentStep1",
    name: "Nuevo Envío",
    icon: "ni ni-circle-08 text-gray-dark",
    component: ShipmentStep1,
    layout: "/admin",
    side: false,
    role: 1,
  },
  {
    path: "/addShipmentStep2",
    name: "Nuevo Envío",
    icon: "ni ni-circle-08 text-gray-dark",
    component: ShipmentStep2,
    layout: "/admin",
    side: false,
    role: 1,
  },
  {
    path: "/addShipmentStep3",
    name: "Nuevo Envío",
    icon: "ni ni-circle-08 text-gray-dark",
    component: ShipmentStep3,
    layout: "/admin",
    side: false,
    role: 1,
  },
  {
    path: "/addShipmentStep4",
    name: "Nuevo Envío",
    icon: "ni ni-circle-08 text-gray-dark",
    component: ShipmentStep4,
    layout: "/admin",
    side: false,
    role: 1,
  },
];
export default routes;
