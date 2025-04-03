import {
  useGetMyWorkoutDetailsQuery,
  useDeleteMyWorkoutMutation,
} from "../slices/myTrainingApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const MyTrainingScreen = () => {
  const {
    data: workouts,
    isLoading,
    error,
    refetch,
  } = useGetMyWorkoutDetailsQuery();
  const [deleteWorkout, { isLoading: loadingDelete }] =
    useDeleteMyWorkoutMutation();

  // Se o erro for "Workout not found", exibe mensagem de treino não adicionado.
  if (
    error &&
    (error?.data?.message === "Treino não encontrado" ||
      error.error === "Treino não encontrado")
  ) {
    return <Message>Nenhum treino adicionado.</Message>;
  }

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Erro ao carregar treino"}
      </Message>
    );

  return (
    <>
      <h2 className="text-center mb-4">My Training</h2>
      {workouts && workouts.length > 0 ? (
        <Row>
          {workouts.map((workout, index) => {
            // A propriedade trainingType foi populada pelo populate() no controller
            const training = workout.trainingType;
            return (
              <Col key={index} md={6} lg={4} className="mb-3">
                <Card className="workout-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary">
                      {training.name}
                    </Card.Title>
                    <Card.Text>
                      <strong>Categoria:</strong> {training.category || "N/A"}
                      {training.description || "Sem descrição"}
                    </Card.Text>
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Tem certeza que deseja deletar este treino?"
                            )
                          ) {
                            deleteWorkout(workout._id)
                              .unwrap()
                              .then(() => {
                                toast.success("Treino deletado");
                                refetch();
                              })
                              .catch((err) => {
                                toast.error(
                                  err?.data?.message ||
                                    "Falha ao deletar treino"
                                );
                              });
                          }
                        }}
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? "Deletando..." : "Deletar treino"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Message>Nenhum treino adicionado.</Message>
      )}
    </>
  );
};

export default MyTrainingScreen;
