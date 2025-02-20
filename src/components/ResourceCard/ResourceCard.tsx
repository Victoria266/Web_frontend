import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Resource} from "modules/types.ts";

interface ResourceCardProps {
    resource: T_Resource,
    isMock: boolean
}

const ResourceCard = ({resource, isMock}: ResourceCardProps) => {
    return (
        <Card key={resource.id} style={{width: '18rem', margin: "0 auto 50px" }}>
            <CardImg
                src={isMock ? mockImage as string : resource.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {resource.name}
                </CardTitle>
                <CardText>
                    Плотность: {resource.density} г/см³
                </CardText>
                <Link to={`/resources/${resource.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ResourceCard