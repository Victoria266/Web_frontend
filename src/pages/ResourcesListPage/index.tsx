import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Resource} from "src/modules/types.ts";
import ResourceCard from "components/ResourceCard";
import {ResourceMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";
import "./styles.css"

type Props = {
    resources: T_Resource[],
    setResources: React.Dispatch<React.SetStateAction<T_Resource[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    resourceName: string,
    setResourceName: React.Dispatch<React.SetStateAction<string>>
}

const ResourcesListPage = ({resources, setResources, isMock, setIsMock, resourceName, setResourceName}:Props) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/resources/?resource_density=${resourceName.toLowerCase()}`)
            const data = await response.json()
            setResources(data.resources)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setResources(ResourceMocks.filter(resource => resource.name.toLowerCase().includes(resourceName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={resourceName} onChange={(e) => setResourceName(e.target.value)} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {resources?.map(resource => (
                    <Col key={resource.id} xs="4">
                        <ResourceCard resource={resource} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ResourcesListPage