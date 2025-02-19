import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftReport,
    fetchReport,
    removeReport, sendDraftReport,
    triggerUpdateMM,
    updateReport
} from "store/slices/reportsSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ReportStatus, T_Resource} from "modules/types.ts";
import ResourceCard from "components/ResourceCard/ResourceCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";

const ReportPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated} = useAppSelector((state) => state.user)

    const report = useAppSelector((state) => state.reports.report)

    const [month, setMonth] = useState<string>(report?.month)

    const [company, setCompany] = useState<string>(report?.company)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchReport(id))
        return () => dispatch(removeReport())
    }, []);

    useEffect(() => {
        setCompany(report?.company)
        setMonth(report?.month)
    }, [report]);

    const sendReport = async (e) => {
        e.preventDefault()

        await saveReport()

        await dispatch(sendDraftReport())

        navigate("/reports/")
    }

    const saveReport = async (e?) => {
        e?.preventDefault()

        const data = {
            month,
            company
        }

        await dispatch(updateReport(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteReport = async () => {
        await dispatch(deleteDraftReport())
        navigate("/resources/")
    }

    if (!report) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = report.status == E_ReportStatus.Draft

    return (
        <Form onSubmit={sendReport} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновой отчет" : `Отчет №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Компания" placeholder="Введите компанию" value={company} setValue={setCompany} disabled={!isDraft}/>
                <CustomInput label="Месяц" placeholder="Введите месяц" value={month} setValue={setMonth} disabled={!isDraft}/>
            </Row>
            <Row>
                {report.resources.length > 0 ? report.resources.map((resource:T_Resource) => (
                    <Row key={resource.id} className="d-flex justify-content-center mb-5">
                        <ResourceCard resource={resource} showRemoveBtn={isDraft} editMM={isDraft} />
                    </Row>
                )) :
                    <h3 className="text-center">Ресурсы не добавлены</h3>
                }
            </Row>
            {isDraft &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveReport}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteReport}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default ReportPage