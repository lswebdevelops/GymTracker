import { useParams, Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card } from "react-bootstrap";

import {
  useGetPoemsQuery,
  useGetPoemDetailsQuery,
} from "../slices/poemsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const PoemScreen = () => {
  const { id: poemId } = useParams();

  // Chama ambos os hooks sempre, mas "pula" a query que não é necessária.
  const {
    data: poems,
    isLoading: isLoadingPoems,
    error: errorPoems,
  } = useGetPoemsQuery({}, { skip: poemId ? true : false });

  const {
    data: poem,
    isLoading: isLoadingPoem,
    error: errorPoem,
  } = useGetPoemDetailsQuery(poemId, { skip: !poemId });

  // Caso não exista um poemId na URL, mostra a lista de poemas
  if (!poemId) {
    return (
      <>
        <div>
          <h1 className="poemsPageH1">Poemas</h1>
        </div>

        {isLoadingPoems ? (
          <Loader />
        ) : errorPoems ? (
          <Message variant="danger">
            {errorPoems?.data?.message || errorPoems.error}
          </Message>
        ) : (
          <div className="poems-containers-div">

         
          <Row id="poems-containers">
            {poems.map((poemItem) => (
              <Col key={poemItem._id} sm={12} md={6} lg={4} className="mb-3">
                <Card className="poemContainer">
                  <Link className="poemLink" to={`/poem/${poemItem._id}`}>
                    <Card.Body>
                      <Card.Title id="poemTitle">{poemItem.title}</Card.Title>
                      <Card.Text id="poemAuthor">
                        Autor: {poemItem.author}
                        <br />
                      </Card.Text>
                      <hr />
                      <Card.Text className="poemContent-poems-page">
                        {poemItem.content}
                      </Card.Text>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
          </div>
        )}
      </>
    );
  }

  // Se existir um poemId, mostra os detalhes do poema
  return (
    <>
      <Link className="btn btn-light my-3" to="/poems">
        Voltar
      </Link>
      {isLoadingPoem ? (
        <Loader />
      ) : errorPoem ? (
        <Message variant="danger">
          {errorPoem?.data?.message || errorPoem.error}
        </Message>
      ) : (
        <Row className="upper-div-poem">
          <Col md={3} sm={8}>
            {poem.image && <Image src={poem.image} alt={poem.title} fluid />}
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3 className="poemTitle">{poem.title}</h3>
              </ListGroup.Item>
              <ListGroup.Item id="poem-content">{poem.content}</ListGroup.Item>
              <ListGroup.Item>
                <h4 className="poemAuthor">{poem.author}</h4>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default PoemScreen;
