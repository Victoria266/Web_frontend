import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import ResourceCard from "components/ResourceCard/ResourceCard.tsx";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {RootState, useAppSelector} from "src/store/store.ts";
import {updateResourceName} from "src/store/slices/resourcesSlice.ts";
import {T_Resource} from "modules/types.ts";
import {ResourceMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";
import "./styles.css"
import {isTauri} from "@tauri-apps/api/core";

type Props = {
    resources: T_Resource[],
    setResources: React.Dispatch<React.SetStateAction<T_Resource[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ResourcesListPage = ({resources, setResources, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {resource_density} = useAppSelector((state:RootState) => state.resources)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateResourceName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setResources(ResourceMocks.filter(resource => resource.name.toLowerCase().includes(resource_density.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchResources()
    }

    const fetchResources = async () => {
        try {
            const env = await import.meta.env;
            const apiUrl = isTauri() ? env.VITE_API_URL : ""
            const response = await fetch(`${apiUrl}/api/resources/?resource_density=${resource_density.toLowerCase()}`)
            const data = await response.json()
            setResources(data.resources)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchResources()
    }, []);

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
            </Row>
            <Row>
                {resources?.map(resource => (
                    <Col key={resource.id} sm="12" md="6" lg="4">
                        <ResourceCard resource={resource} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ResourcesListPage