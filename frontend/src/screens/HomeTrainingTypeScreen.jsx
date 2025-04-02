import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import {
  useGetTrainingTypeDetailsQuery,
  useCreateReviewMutation,
} from "../slices/trainingTypesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const TrainingTypeScreen = () => {
  const { id: trainingTypeId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: trainingType,
    isLoading,
    refetch,
    error,
  } = useGetTrainingTypeDetailsQuery(trainingTypeId);

  const [createReview, { isLoading: loadingTrainingTypeReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        trainingTypeId,
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
      <Link className="btn btn-light my-3" to="/trainingTypes">
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
          <div className="upper-div-trainingType-div">
            <Row className="upper-div-trainingType upper-div-training">
              <Col md={6}>
                <h3>{trainingType.name}</h3>
                <h4>{trainingType.category}</h4>
                <p>{trainingType.description}</p>
              </Col>
            </Row>
          </div>
          <hr />
        </>
      )}
    </>
  );
};

export default TrainingTypeScreen;
