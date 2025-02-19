import {Button, Col, Container, Row} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import React, {useEffect, useState} from "react";
import mock from "src/assets/mock.png"
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";
import {createResource} from "store/slices/resourcesSlice.ts";
import {T_ResourceAddData} from "modules/types.ts";

const ResourceAddPage = () => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>()

    const [description, setDescription] = useState<string>()

    const [density, setDensity] = useState<number>()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState(mock)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const handleCreateResource = async() => {
        if (!name || !description || !density) {
            return
        }

        const formData = new FormData()

        formData.append('name', name)
        formData.append('description', description)
        formData.append('density', density as string)

        if (imgFile != undefined) {
            formData.append('image', imgFile, imgFile.name)
        }

        await dispatch(createResource(formData as T_ResourceAddData))

        navigate("/resources-table/")
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL as string} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput type="number" label="Плотность" placeholder="Введите плотность" value={density} setValue={setDensity}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={handleCreateResource}>Создать</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default ResourceAddPage