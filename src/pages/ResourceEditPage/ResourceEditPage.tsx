import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteResource,
    fetchResource,
    removeSelectedResource,
    updateResource,
    updateResourceImage
} from "store/slices/resourcesSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const ResourceEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {resource} = useAppSelector((state) => state.resources)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(resource?.name)

    const [description, setDescription] = useState<string>(resource?.description)

    const [density, setDensity] = useState<number>(resource?.density)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(resource?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveResource = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateResourceImage({
                resource_id: resource.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            density
        }

        await dispatch(updateResource({
            resource_id: resource.id,
            data
        }))

        navigate("/resources-table/")
    }

    useEffect(() => {
        dispatch(fetchResource(id))
        return () => dispatch(removeSelectedResource())
    }, []);

    useEffect(() => {
        setName(resource?.name)
        setDescription(resource?.description)
        setDensity(resource?.density)
        setImgURL(resource?.image)
    }, [resource]);

    const handleDeleteResource = async () => {
        await dispatch(deleteResource(id))
        navigate("/resources-table/")
    }

    if (!resource) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput type="number" label="Плотность" placeholder="Введите плотность" value={density} setValue={setDensity}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={saveResource}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteResource}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default ResourceEditPage