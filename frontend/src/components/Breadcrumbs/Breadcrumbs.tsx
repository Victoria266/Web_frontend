import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Resource} from "modules/types.ts";
import "./styles.css"

type Props = {
    selectedResource: T_Resource | null
}

const Breadcrumbs = ({selectedResource}:Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/resources") &&
                <BreadcrumbItem active>
                    <Link to="/resources">
						Ресурсы
                    </Link>
                </BreadcrumbItem>
			}
            {selectedResource &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedResource.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs