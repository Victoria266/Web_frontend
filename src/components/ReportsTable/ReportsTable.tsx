import {useAppSelector} from "store/store.ts";
import {Card, Col, Row} from "reactstrap";
import ReportCard from "components/ReportCard/ReportCard.tsx";
import {T_Report} from "modules/types.ts";
import "./ReportTable.css"

type Props = {
    reports:T_Report[]
}

const ReportsTable = ({reports}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    return (
        <div className="mb-5">
            <div className="mb-2" style={{fontWeight: "bold"}}>
                <Card style={{padding: "10px"}}>
                    <Row>
                        <Col md={1}>
                            №
                        </Col>
                        <Col md={1}>
                            Статус
                        </Col>
                        <Col>
                            Дата создания
                        </Col>
                        <Col>
                            Дата формирования
                        </Col>
                        <Col>
                            Дата завершения
                        </Col>
                        {!is_superuser &&
                            <Col>
                                Действие
                            </Col>
                        }
                        {is_superuser &&
                            <>
                                <Col>
                                    Пользователь
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                            </>
                        }
                    </Row>
                </Card>
            </div>
            <div className="d-flex flex-column gap-2">
                {reports.map((report, index) => (
                    <ReportCard report={report} index={index} key={index}/>
                ))}
            </div>
        </div>
    )
};

export default ReportsTable