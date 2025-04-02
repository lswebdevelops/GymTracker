import { Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetTrainingTypesQuery } from "../slices/trainingTypesApiSlice";
import { Link } from "react-router-dom";
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import homePhoto from "../assets/gymPhoto.png"

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetTrainingTypesQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="trainingTypeHomeScreenContainer ">
      <div className="homeScreen">
        {!keyword ? (
          // for showing the carousel "comment out || uncomment"
          
          <Image src={homePhoto} alt="photo of a gym" className="photo-home-screen" /> ||          
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
            <h1 className="h1-recent-titles">Exercício do Dia</h1>
            <Row>
              {data.trainingTypes.map((trainingType) => (
                <Col key={trainingType._id} sm={12} md={6} lg={4} xl={3}>
                  <TrainingType trainingType={trainingType} />
                </Col>
              ))}
            </Row>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ""}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
