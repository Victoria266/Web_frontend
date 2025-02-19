import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import ResourcesListPage from "pages/ResourcesListPage/ResourcesListPage.tsx";
import ResourcePage from "pages/ResourcePage/ResourcePage.tsx";
import ReportsPage from "pages/ReportsPage/ReportsPage.tsx";
import ReportPage from "pages/ReportPage/ReportPage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/resources/" element={<ResourcesListPage />} />
                        <Route path="/resources/:id/" element={<ResourcePage />} />
                        <Route path="/reports/" element={<ReportsPage />} />
                        <Route path="/reports/:id/" element={<ReportPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
