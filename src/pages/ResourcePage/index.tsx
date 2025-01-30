import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Resource} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {ResourceMocks} from "src/modules/mocks.ts";
import mockImage from "assets/mock.png";

type Props = {
    selectedResource: T_Resource | null,
    setSelectedResource: React.Dispatch<React.SetStateAction<T_Resource | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ResourcePage = ({selectedResource, setSelectedResource, isMock, setIsMock}: Props) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/resources/${id}`)
            const data = await response.json()
            setSelectedResource(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedResource(ResourceMocks.find(resource => resource?.id == parseInt(id as string)) as T_Resource)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedResource(null)
    }, []);

    if (!selectedResource) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={isMock ? mockImage as string : selectedResource.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedResource.name}</h1>
                    <p className="fs-5">Описание: {selectedResource.description}</p>
                    <p className="fs-5">Плотность: {selectedResource.density} г/см³</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ResourcePage