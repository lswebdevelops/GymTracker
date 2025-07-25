import { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  useGetMyWorkoutDetailsQuery,
  useUpdateMyWorkoutMutation,
} from "../slices/myTrainingApiSlice";
import { Link } from "react-router-dom";
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";
import image_logout from "../assets/image_logout.png";

// Defina seu mapeamento aqui ou importe de outro lugar se já tiver
const TRAINING_CODE_TO_MUSCLE_GROUP = {
  'A1': 'Pernas', 'A2': 'Pernas', 'A3': 'Pernas', 'A4': 'Pernas', 'A5': 'Pernas',
  'B1': 'Costas', 'B2': 'Costas', 'B3': 'Costas', 'B4': 'Costas', 'B5': 'Costas',
  'C1': 'Bíceps', 'C2': 'Bíceps', 'C3': 'Bíceps', 'C4': 'Bíceps', 'C5': 'Bíceps',
  'D1': 'Tríceps', 'D2': 'Tríceps', 'D3': 'Tríceps', 'D4': 'Tríceps', 'D5': 'Tríceps',
  'E1': 'Peito', 'E2': 'Peito', 'E3': 'Peito', 'E4': 'Peito', 'E5': 'Peito',
  'F1': 'Funcional', 'F2': 'Funcional', 'F3': 'Funcional', 'F4': 'Funcional', 'F5': 'Funcional'
};

const HomeScreen = () => {
  const { keyword } = useParams();
  const {
    data: myWorkout,
    isLoading,
    error,
    refetch,
  } = useGetMyWorkoutDetailsQuery();
  const [updateWorkout] = useUpdateMyWorkoutMutation();

  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(
    parseInt(localStorage.getItem("currentWorkoutIndex")) || 0
  );

  useEffect(() => {
    if (myWorkout && myWorkout.length > 0) {
      // Ordena os treinos pelo 'createdAt' para garantir a sequência correta
      // Isso é crucial se a ordem de adição for a ordem desejada na barra
      const sortedWorkouts = [...myWorkout].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setWorkoutsArray(sortedWorkouts);
    } else {
      setWorkoutsArray([]);
    }
  }, [myWorkout]);

  const handleWorkoutDone = async (id) => {
    // console.log('Botão "Treino Concluído" clicado! ID do treino:', id);
    try {
      const result = await updateWorkout({
        id,
        workoutData: { status: "completed" },
      }).unwrap();
      // console.log("Resultado da mutation updateWorkout:", result);

      // Avança para o próximo treino na sequência
      const newIndex = (currentWorkoutIndex + 1) % workoutsArray.length;
      setCurrentWorkoutIndex(newIndex);
      localStorage.setItem("currentWorkoutIndex", newIndex);

      // Refetch para atualizar os dados, o que pode recalcular a barra de progresso
      // O refetch é importante para o caso de um treino ser o último e o índice resetar,
      // ou se você decidir usar o 'status' real do DB para a barra futuramente.
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

  const workoutOfTheDay =
    workoutsArray.length > 0 && currentWorkoutIndex < workoutsArray.length
      ? workoutsArray[currentWorkoutIndex]
      : null;

  return (
    <Container className="trainingTypeHomeScreenContainer text-center py-4">
      {!keyword ? (
        <h1 className="h1-recent-titles mb-4">Seu Exercício</h1>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Voltar
        </Link>
      )}

      {workoutOfTheDay ? (
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
            Treino Concluído
          </Button>

          {/* BARRA DE PROGRESSO DO TREINO */}
          {workoutsArray.length > 0 && (
            <div className="workout-progress-bar-container mt-5">
              <Row className="justify-content-center">
                <Col xs={12} className="d-flex justify-content-center flex-wrap">
                  {workoutsArray.map((workout, index) => (
                    <div
                      key={workout._id} // Usar o _id como chave é melhor do que o index
                      className={`workout-progress-item 
                        ${index < currentWorkoutIndex ? 'completed-past' : ''} 
                        ${index === currentWorkoutIndex ? 'current-active' : ''}
                        ${index > currentWorkoutIndex ? 'pending-future' : ''}
                      `}
                      title={TRAINING_CODE_TO_MUSCLE_GROUP[workout.trainingType.name]}
                    >
                      {/* Presumindo que workout.trainingType.name é "A1", "B1", etc. */}
                      {workout.trainingType.name}
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          )}
          {/* FIM DA BARRA DE PROGRESSO DO TREINO */}

        </>
      ) : (
        <>
          <Message variant="info">Nenhum treino encontrado.</Message>
          <p className="mt-3">Você ainda não adicionou nenhum treino.</p>
          <p className="red_home_message">
            Se adicionou ou removeu treinos recentemente e eles não aparecem,
            tente entrar novamente (deslogar e logar).
          </p>
          <p>Click em seu nome e sair:</p>
          <img
            src={image_logout}
            alt="logout image"
            className="img-fluid mt-3"
          />
        </>
      )}
    </Container>
  );
};

export default HomeScreen;