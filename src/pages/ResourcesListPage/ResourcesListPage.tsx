import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchResources, updateResourceName} from "store/slices/resourcesSlice.ts";
import ResourceCard from "components/ResourceCard/ResourceCard.tsx";
import Bin from "components/Bin/Bin.tsx";

const ResourcesListPage = () => {

    const dispatch = useAppDispatch()

    const {resources, resource_density} = useAppSelector((state) => state.resources)

    const {is_authenticated} = useAppSelector((state) => state.user)

    const {draft_report_id, resources_count} = useAppSelector((state) => state.reports)

    const hasDraft = draft_report_id != null

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
                {is_authenticated &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_report_id={draft_report_id} resources_count={resources_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {resources?.map(resource => (
                    <Col key={resource.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <ResourceCard resource={resource} showAddBtn={is_authenticated} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ResourcesListPage