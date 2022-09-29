import React from "react";
// reactstrap components
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Table,
    Container,
    Row,
    UncontrolledTooltip,
    CardBody
  } from "reactstrap";
  // core components
  import Header from "components/Headers/Header.js";
class Construction extends React.Component{
    render() {
        return (
            <>
            <Header/>
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                        <h3 className="mb-0">Registros </h3>
                        </CardHeader>
                        {/*<Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                            <tr>
                            <th scope="col">Código de aeropuerto</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Ciudad</th>
                            <th scope="col">Longitud</th>
                            <th scope="col">Latitud</th>
                            <th scope="col" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr></tr>
                            <tr></tr>
                        </tbody>
                        </Table>*/}
                        <CardBody>
                            <h1>En construcción</h1>
                        </CardBody>
                    </Card>
                    </div>
                </Row>
            </Container>
            </>
        )
    }
}  
export default Construction;