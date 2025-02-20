import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import ResourcePage from "pages/ResourcePage/ResourcePage.tsx";
import ResourcesListPage from "pages/ResourcesListPage/ResourcesListPage.tsx";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage/HomePage.tsx";
import {useState} from "react";
import {T_Resource} from "modules/types.ts";

function App() {

    const [resources, setResources] = useState<T_Resource[]>([])

    const [selectedResource, setSelectedResource] = useState<T_Resource | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedResource={selectedResource}/>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/resources/" element={<ResourcesListPage resources={resources} setResources={setResources} isMock={isMock} setIsMock={setIsMock} />} />
                        <Route path="/resources/:id" element={<ResourcePage selectedResource={selectedResource} setSelectedResource={setSelectedResource} isMock={isMock} setIsMock={setIsMock} />} />
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default App
