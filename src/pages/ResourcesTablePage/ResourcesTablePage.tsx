import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchResources, updateResourceName} from "store/slices/resourcesSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import ResourcesTable from "components/ResourcesTable/ResourcesTable.tsx";

const ResourcesTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {resources, resource_density} = useAppSelector((state) => state.resources)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateResourceName(e.target.value))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchResources())
    }

    useEffect(() => {
        dispatch(fetchResources())
    }, [])

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={resource_density} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/resources/add">
                        <Button color="primary">Создать ресурс</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {resources.length > 0 ? <ResourcesTable resources={resources} fetchResources={fetchResources}/> : <h3 className="text-center mt-5">Ресурсы не найдены</h3>}
            </Row>
        </Container>
    );
};

export default ResourcesTablePage