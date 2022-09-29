import React from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import APIWarehouse from "./../../apis/APIWarehouse.js";
import APIPackage from "./../../apis/APIPackage.js";
import APIStorage from "./../../apis/APIStorage.js";
const serviceWarehouse = new APIWarehouse();
const serviceStorage = new APIStorage();
const servicePackage = new APIPackage();

class Warehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoPacks: [],
      infoPack: [],
      foundPack: false,
      storage: 600,
      codeWarehouse: 1,
      packsNumber: 30,
      full: false,
      listPages: [],
      page: 1,
      pages: 0,
      iniPage: 0,
      finPage: 10,
      pageItems: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.findPackByCode = this.findPackByCode.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.handleCurrentPage = this.handleCurrentPage.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  handleChange = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  findPackByCode = async (event) => {
    //Buscar vuelo por código de vuelo
    var infoPack;
    /*const infoPack = await serviceAirport.findFlightById(
      this.state.flightCode
    );*/
    const message = infoPack["estado"];
    if (message.length < 3) {
      //Ok
      this.setState({
        infoPack: infoPack["resultado"],
        foundPack: true,
        pageItems: infoPack["resultado"],
      });
    } else {
      this.setState({
        foundPack: false,
      });
    }
  };
  checkout = async (idPack) => {
    //confirmar salida del paquete
    const idWarehouseUser = sessionStorage.getItem("idAirport");
    const result = await serviceStorage.updateCheckOut(idPack, idWarehouseUser);
    //actualizar paquetes para ver el nuevo estado
    if (result["estado"].length < 3) {
      const resultPackages = await servicePackage.queryAllPackagesOutgoing(
        idWarehouseUser
      );

      if (resultPackages["estado"].length < 3) {
        let pageItems = resultPackages["resultado"].slice(
          this.state.iniPage,
          this.state.finPage
        );
        this.setState({
          infoPacks: resultPackages["resultado"],
          pageItems: pageItems,
        });
      }
    }
  };
  componentWillMount = async () => {
    console.log(idWarehouseUser);
    //se obtiene el grupo de paquetes del almacén
    const idWarehouseUser = sessionStorage.getItem("idAirport");
    const resultPackages = await servicePackage.queryAllPackagesOutgoing(
      idWarehouseUser
    );

    if (resultPackages["estado"].length < 3) {
      let pageItems = resultPackages["resultado"].slice(
        this.state.iniPage,
        this.state.finPage
      );
      this.setState({
        infoPacks: resultPackages["resultado"],
        pages: Math.ceil(resultPackages["resultado"].length / 10),
        pageItems: pageItems,
      });

      let listPages = [];
      for (let i = 0; i < this.state.pages; i++) {
        this.state.listPages.push(i + 1);
      }
      //console.log(this.state.pageItems);
    }
  };
  handlePrevPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoPacks.slice(
      this.state.iniPage - 10,
      this.state.finPage - 10
    );
    this.setState({
      page: this.state.page - 1,
      iniPage: this.state.iniPage - 10,
      finPage: this.state.finPage - 10,
      pageItems: pageItems,
    });
    //console.log(this.state.pageItems);
  };
  handleNextPage = (event) => {
    //console.log(this.state.infoShipments);
    let pageItems = this.state.infoPacks.slice(
      this.state.iniPage + 10,
      this.state.finPage + 10
    );
    this.setState({
      page: this.state.page + 1,
      iniPage: this.state.iniPage + 10,
      finPage: this.state.finPage + 10,
      pageItems: pageItems,
    });
    //console.log(this.state.pageItems);
  };
  handleCurrentPage = (event) => {
    let inicio = 0;
    let fin = 9;
    while (!(inicio <= event.target.value) && !(fin >= event.target.value)) {
      inicio = inicio + 10;
      fin = fin + 10;
    }
    let pageItems = this.state.infoPacks.slice(inicio, fin);
    this.setState({
      page: event.target.value,
      iniPage: inicio,
      finPage: fin,
      pageItems: pageItems,
    });
  };

  render() {
    let items = [];
    let x;
    if (this.state.page % 10 == 0) {
      x = Math.floor(this.state.page / 10) - 1;
    } else {
      x = Math.floor(this.state.page / 10);
    }
    let ini = 1 + x * 10;
    let y = 0;
    let fin = 1 + x * 10;
    if (this.state.pages <= 10) {
      fin = this.state.pages;
    } else {
      fin = 10 + x * 10;
      console.log(fin);
    }

    if (this.state.foundFlight) {
      for (let number = 1; number <= 1; number++) {
        items.push(
          <PaginationItem
            value={number}
            className={this.state.page === number ? "active" : "disabled"}
          >
            <PaginationLink>{number}</PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      //console.log("shrek");
      for (let number = ini; number <= fin; number++) {
        if (this.state.pages >= number) {
          items.push(
            <PaginationItem
              value={number}
              className={this.state.page === number ? "active" : "disabled"}
            >
              <PaginationLink>{number}</PaginationLink>
            </PaginationItem>
          );
        }
      }
    }
    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                    <Col>
                      <h3 className="mb-0">Almacén</h3>
                    </Col>
                  </Row>
                  <br />
                </CardHeader>
                
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Código</th>
                        <th scope="col">Ciudad, País Origen</th>
                        <th scope="col">Ciudad, País Destino</th>
                        <th scope="col">Características</th>
                        <th scope="col">Frágil</th>
                        {/*<th scope="col">Estado</th>*/}
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.pageItems.map((pack) => {
                        let currentStage = pack["pack"]["routePlan"]["currentStage"];
                        let length =  pack["pack"]["routePlan"]["flightPlans"].length;
                        currentStage == length? currentStage=currentStage-1: currentStage=currentStage;
                        return (
                          <tr key = {pack["trackingCode"]} >
                            <th>{pack["trackingCode"]}</th>
                            <td>{pack["pack"]["routePlan"]["flightPlans"][currentStage]["flight"]["takeOffAirport"]["city"]["name"]+", "+
                                pack["pack"]["routePlan"]["flightPlans"][currentStage]["flight"]["takeOffAirport"]["city"]["country"]["name"]}</td>
                            <td>{pack["pack"]["routePlan"]["flightPlans"][currentStage]["flight"]["arrivalAirport"]["city"]["name"]+", "+
                                pack["pack"]["routePlan"]["flightPlans"][currentStage]["flight"]["arrivalAirport"]["city"]["country"]["name"]}</td>
                            <td>{pack["pack"]["weight"]+"kg, "+pack["pack"]["large"]+"cm x "+pack["pack"]["width"]+"cm x "+pack["pack"]["high"]+"cm"}</td>
                            <td>{pack["pack"]["fragile"] ? "Sí" : "No"}</td>
                            {/*<td>{pack["pack"]["status"]}</td>*/}
                            <td>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#drop"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu
                                  className="dropdown-menu-arrow"
                                  right
                                >
                                  <DropdownItem
                                    href="#checkout"
                                    onClick={() => this.checkout(pack["pack"]["id"])}
                                  >
                                    Confirmar salida
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                </Table>                
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem
                        className={this.state.page - 1 == 0 ? "disabled" : ""}
                      >
                        <PaginationLink
                          onClick={this.handlePrevPage}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      {items}
                      <PaginationItem
                        className={
                          this.state.page == this.state.pages ? "disabled" : ""
                        }
                      >
                        <PaginationLink onClick={this.handleNextPage}>
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}
export default Warehouse;
