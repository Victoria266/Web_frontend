import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchResource, removeSelectedResource} from "store/slices/resourcesSlice.ts";

const ResourcePage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {resource} = useAppSelector((state) => state.resources)

    useEffect(() => {
        dispatch(fetchResource(id))
        return () => dispatch(removeSelectedResource())
    }, []);

    if (!resource) {
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
                        src={resource.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{resource.name}</h1>
                    <p className="fs-5">Описание: {resource.description}</p>
                    <p className="fs-5">Плотность: {resource.density} г/см³</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ResourcePage