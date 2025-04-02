import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetTrainingTypesQuery } from "../slices/trainingTypesApiSlice";
import { Link } from "react-router-dom";
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";

const TrainingTypeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetTrainingTypesQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="trainingTypeHomeScreenContainer">
      <div className="homeScreen">
        {!keyword ? (
          ""
        ) : (
          <Link to="/" className="btn btn-light mb-4">
            Voltar
          </Link>
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h1 className="trainingTypesPageH1">Treinos</h1>
            <Row>
              {data.trainingTypes.map((trainingType) => (
                <Col
                  key={trainingType._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="home-screen-training-box"
                >
                  <TrainingType trainingType={trainingType} />
                  <Col md={6}></Col>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainingTypeScreen;
