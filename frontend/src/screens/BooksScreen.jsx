import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetBooksQuery } from "../slices/booksApiSlice";
import { Link } from "react-router-dom";
import Book from "../components/Book";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BookScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetBooksQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="bookHomeScreenContainer">
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
            <h1 className="booksPageH1">Treinos</h1>
            <Row>
              {data.books.map((book) => (
                <Col
                  key={book._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="home-screen-training-box"
                >
                  <Book book={book} />
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

export default BookScreen;
