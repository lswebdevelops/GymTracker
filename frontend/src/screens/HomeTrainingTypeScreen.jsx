import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetTrainingTypeDetailsQuery,
  useCreateReviewMutation,
} from "../slices/trainingTypesApiSlice";
import { useCreateMyWorkoutMutation } from "../slices/myTrainingApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeTrainingTypeScreen = () => {
  const { id: trainingTypeId } = useParams();
  const navigate = useNavigate();
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

  const [createMyWorkout, { isLoading: loadingMyWorkout }] =
    useCreateMyWorkoutMutation();

  const addToMyWorkoutHandler = async () => {
    if (!trainingType) return;
    try {
      await createMyWorkout({
        trainingTypeId: trainingType._id,
        name: trainingType.name,
        category: trainingType.category,
        description: trainingType.description,
        image: trainingType.image,
      }).unwrap();
      toast.success("Added to MyWorkout!");
    } catch (err) {
      if (err?.data?.message === "Not authorized, no token") {
        navigate("/login");
      } else {
        toast.error(err?.data?.message || "Failed to add workout");
      }
    }
  };

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
                <Button
                  onClick={addToMyWorkoutHandler}
                  className="btn btn-primary mt-3"
                  disabled={loadingMyWorkout}
                >
                  {loadingMyWorkout ? "Adding..." : "Adicionar a Meu Treino"}
                </Button>
              </Col>
            </Row>
          </div>
          <hr />
        </>
      )}
    </>
  );
};

export default HomeTrainingTypeScreen;
