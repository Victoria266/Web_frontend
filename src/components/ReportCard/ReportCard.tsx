import {Button, Card, Col, Row} from "reactstrap";
import {E_ReportStatus, T_Report} from "modules/types.ts";
import {formatDate} from "utils/utils.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {acceptReport, fetchReports, rejectReport} from "store/slices/reportsSlice.ts";

type Props = {
    report: T_Report
    index: number
}

const ReportCard = ({report, index}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptReport = async (report_id) => {
        await dispatch(acceptReport(report_id))
        await dispatch(fetchReports())
    }

    const handleRejectReport = async (report_id) => {
        await dispatch(rejectReport(report_id))
        await dispatch(fetchReports())
    }

    const navigate = useNavigate()

    const openReportPage = () => {
        navigate(`/reports/${report.id}`)
    }

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[report.status]}
                </Col>
                <Col>
                    {formatDate(report.date_created)}
                </Col>
                <Col>
                    {formatDate(report.date_formation)}
                </Col>
                <Col>
                    {formatDate(report.date_complete)}
                </Col>
                {!is_superuser &&
                    <Col>
                        <Button color="primary" onClick={openReportPage}>Открыть</Button>
                    </Col>
                }
                {is_superuser &&
                    <>
                        <Col>
                            {report.owner}
                        </Col>
                        <Col>
                            {report.status == E_ReportStatus.InWork && <Button color="primary" onClick={() => handleAcceptReport(report.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {report.status == E_ReportStatus.InWork && <Button color="danger" onClick={() => handleRejectReport(report.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default ReportCard