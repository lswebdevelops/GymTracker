import { useState, useEffect } from "react";
import { Row, Col, Image, Container, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  useGetMyWorkoutDetailsQuery,
  useUpdateMyWorkoutMutation,
} from "../slices/myTrainingApiSlice";
import { Link } from "react-router-dom";
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";
import homePhoto from "../assets/gymPhoto.png";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const {
    data: myWorkout,
    isLoading,
    error,
    refetch,
  } = useGetMyWorkoutDetailsQuery();
  const [updateWorkout] = useUpdateMyWorkoutMutation();

  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  useEffect(() => {
    if (myWorkout && myWorkout.length > 0) {
      setWorkoutsArray(myWorkout);
    } else {
      setWorkoutsArray([]);
    }
  }, [myWorkout]);

  const handleWorkoutDone = async (id) => {
    try {
      await updateWorkout({
        id,
        workoutData: { status: "completed" },
      }).unwrap();

      setCurrentWorkoutIndex(
        (prevIndex) => (prevIndex + 1) % workoutsArray.length
      );

      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error) {
      console.error("Erro ao marcar treino como feito:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  const workoutOfTheDay = workoutsArray[currentWorkoutIndex] || null;

  return (
    <Container className="trainingTypeHomeScreenContainer text-center py-4">
      {!keyword ? (
        <h1 className="h1-recent-titles mb-4">Exercício do Dia</h1>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Voltar
        </Link>
      )}

      {workoutsArray.length > 0 ? (
        <>
          <Row className="justify-content-center box-training-day">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}>
              <TrainingType trainingType={workoutOfTheDay.trainingType} />
            </Col>
          </Row>
          <Button
            variant="success"
            className="mt-3 w-50 button-training-done"
            onClick={() => handleWorkoutDone(workoutOfTheDay._id)}
          >
            Próximo Treino
          </Button>
        </>
      ) : (
        <>
          <Message variant="info">Nenhum treino encontrado.</Message>
          <p className="mt-3">Adicione novos treinos para começar!</p>
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
