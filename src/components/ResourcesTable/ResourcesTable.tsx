import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Resource} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteResource} from "store/slices/resourcesSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    resources:T_Resource[]
}

const ResourcesTable = ({resources}:Props) => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (resource_id) => {
        navigate(`/resources/${resource_id}`)
    }

    const openResourceEditPage = (resource_id) => {
        navigate(`/resources/${resource_id}/edit`)
    }

    const handleDeleteResource = async (resource_id) => {
        dispatch(deleteResource(resource_id))
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Фото',
                accessor: 'image',
                Cell: ({ value }) => <img src={value} width={100} />
            },
            {
                Header: 'Название',
                accessor: 'name',
                Cell: ({ value }) => value
            },
            {
                Header: 'Плотность',
                accessor: 'density',
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "edit_button",
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => openResourceEditPage(cell.row.values.id)}>Редактировать</Button>
                )
            },
            {
                Header: "Удалить",
                accessor: "delete_button",
                Cell: ({ cell }) => (
                    <Button color="danger" onClick={() => handleDeleteResource(cell.row.values.id)}>Удалить</Button>
                )
            }
        ],
        []
    )

    if (!resources.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={resources} onClick={handleClick} />
    )
};

export default ResourcesTable