import { useState, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
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
  const { data: myWorkout, isLoading, error, refetch } = useGetMyWorkoutDetailsQuery();
  const [updateWorkout] = useUpdateMyWorkoutMutation();

  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  // Atualiza a lista de treinos apenas uma vez quando a API responder
  useEffect(() => {
    if (myWorkout && myWorkout.length > 0) {
      setWorkoutsArray(myWorkout);
    }
  }, [myWorkout]); // NÃO reinicializa currentWorkoutIndex

  const handleWorkoutDone = async (id) => {
    try {
      console.log("Enviando atualização para treino ID:", id);
      await updateWorkout({ id, workoutData: { status: "completed" } }).unwrap();
      console.log("Treino atualizado!");

      // Avança para o próximo treino antes de refazer a busca
      setCurrentWorkoutIndex((prevIndex) => (prevIndex + 1) % workoutsArray.length);

      // Faz o refetch sem resetar o índice
      setTimeout(() => {
        console.log("Atualizando lista de treinos...");
        refetch();
      }, 500);
    } catch (error) {
      console.error("Erro ao marcar treino como feito:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  const workoutOfTheDay = workoutsArray[currentWorkoutIndex] || null;
  console.log("Treino do dia atualizado:", workoutOfTheDay);

  return (
    <div className="trainingTypeHomeScreenContainer">
      <div className="homeScreen">
        {!keyword ? (
          <Image src={homePhoto} alt="photo of a gym" className="photo-home-screen" />
        ) : (
          <Link to="/" className="btn btn-light mb-4">
            Voltar
          </Link>
        )}

        {workoutOfTheDay ? (
          <>
            <h1 className="h1-recent-titles">Exercício do Dia</h1>
            <Row>
              <Col sm={12} md={6} lg={4} xl={3}>
                <TrainingType trainingType={workoutOfTheDay.trainingType} />
              </Col>
            </Row>
            <button className="btn btn-success mt-3" onClick={() => handleWorkoutDone(workoutOfTheDay._id)}>
              Treino Feito
            </button>
          </>
        ) : (
          <Message variant="info">Nenhum treino encontrado.</Message>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
