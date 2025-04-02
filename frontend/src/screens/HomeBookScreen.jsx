import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
  useGetBookDetailsQuery,
  useCreateReviewMutation,
} from "../slices/booksApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const BookScreen = () => {
  const { id: bookId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: book,
    isLoading,
    refetch,
    error,
  } = useGetBookDetailsQuery(bookId);

  const [createReview, { isLoading: loadingBookReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        bookId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review Submitted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/books">
        Voltar
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <hr />
          <div className="upper-div-book-div">
            <Row className="upper-div-book upper-div-training">
              <Col md={6}>
                <h3>{book.name}</h3>
                <h4>{book.category}</h4>
                <p>{book.description}</p>
              </Col>
            </Row>
          </div>
          <hr />
        </>
      )}
    </>
  );
};

export default BookScreen;
