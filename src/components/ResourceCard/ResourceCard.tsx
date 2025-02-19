import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {E_ReportStatus, T_Resource} from "modules/types.ts";
import {
    removeResourceFromDraftReport,
    updateResourceValue
} from "store/slices/reportsSlice.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addResourceToReport, fetchResources} from "store/slices/resourcesSlice.ts";

type Props = {
    resource: T_Resource,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean
}

const ResourceCard = ({resource, showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {report, save_mm} = useAppSelector(state => state.reports)

    const [local_plan_volume, setLocal_plan_volume] = useState(resource.plan_volume)

    const location = useLocation()

    const isReportPage = location.pathname.includes("reports")

    const handeAddToDraftReport = async () => {
        await dispatch(addResourceToReport(resource.id))
        await dispatch(fetchResources())
    }

    const handleRemoveFromDraftReport = async () => {
        await dispatch(removeResourceFromDraftReport(resource.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateResourceValue({
            resource_id: resource.id,
            plan_volume: local_plan_volume
        }))
    }

    if (isReportPage) {
        return (
            <Card key={resource.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={resource.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {resource.name}
                            </CardTitle>
                            <CardText>
                                Плотность: {resource.density} г/см³
                            </CardText>
                            <CustomInput label="Плановый обьем" type="number" value={local_plan_volume} setValue={setLocal_plan_volume} disabled={!editMM || is_superuser} className={"w-25"}/>
                            {report.status == E_ReportStatus.Completed && <CustomInput label="Реальный обьем" type="number" value={resource.volume} disabled={true} className={"w-25"}/>}
                            <Col className="d-flex gap-5">
                                <Link to={`/resources/${resource.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftReport}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    };

    return (
        <Card key={resource.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={resource.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {resource.name}
                </CardTitle>
                <CardText>
                    Плотность: {resource.density} г/см³
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/resources/${resource.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {!is_superuser && showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftReport}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default ResourceCard