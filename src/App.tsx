import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import ResourcePage from "pages/ResourcePage";
import ResourcesListPage from "pages/ResourcesListPage";
import {Route, Routes} from "react-router-dom";
import {T_Resource} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [resources, setResources] = useState<T_Resource[]>([])

    const [selectedResource, setSelectedResource] = useState<T_Resource | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [resourceName, setResourceName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedResource={selectedResource} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/resources/" element={<ResourcesListPage resources={resources} setResources={setResources} isMock={isMock} setIsMock={setIsMock} resourceName={resourceName} setResourceName={setResourceName}/>} />
                        <Route path="/resources/:id" element={<ResourcePage selectedResource={selectedResource} setSelectedResource={setSelectedResource} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
