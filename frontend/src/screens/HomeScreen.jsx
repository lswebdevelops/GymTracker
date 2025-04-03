import { useState } from "react";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useGetTrainingTypesQuery } from "../slices/trainingTypesApiSlice";
import { useCreateMyWorkoutMutation } from "../slices/myTrainingApiSlice"; // ALTERADO AQUI
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";

const TrainingTypeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetTrainingTypesQuery({
    keyword,
    pageNumber,
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [showAlert, setShowAlert] = useState(false);
  const [createWorkout] = useCreateMyWorkoutMutation(); // ALTERADO AQUI

  // Ordenar os exercícios pelo nome
  const sortedTrainingTypes = data?.trainingTypes
    ? [...data.trainingTypes].sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      })
    : [];

  // Função para adicionar o treino
  const handleAddToWorkout = async (trainingTypeId) => {
    try {
      await createWorkout({ trainingTypeId }).unwrap(); // ALTERADO AQUI
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error("Erro ao adicionar treino:", error);
    }
  };

  return (
    <div className="trainingTypeHomeScreenContainer">
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
            <h1 className="trainingTypesPageH1">Treinos</h1>

            {/* Alerta de sucesso */}
            {showAlert && (
              <Alert variant="success">Treino adicionado com sucesso!</Alert>
            )}

            {/* Filtro de ordenação */}
            <Form.Group controlId="filterOrder" className="mb-3">
              <Form.Label>Ordenar por:</Form.Label>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </Form.Select>
            </Form.Group>

            <Row>
              {sortedTrainingTypes.map((trainingType) => (
                <Col
                  key={trainingType._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="home-screen-training-box"
                >
                  <TrainingType trainingType={trainingType} />
                  <Button
                    variant="primary"
                    className="mt-2 w-100"
                    onClick={() => handleAddToWorkout(trainingType._id)}
                  >
                    Adicionar ao Meu Treino
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainingTypeScreen;
