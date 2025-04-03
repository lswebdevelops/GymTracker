import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetTrainingTypesQuery,
  useCreateTrainingTypeMutation,
  useDeleteTrainingTypeMutation,
} from "../../slices/trainingTypesApiSlice";
import { toast } from "react-toastify";

const TrainingTypeListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetTrainingTypesQuery({
    pageNumber,
  });

  const [createTrainingType, { isLoading: loadingCreate }] =
    useCreateTrainingTypeMutation();

  const [deleteTrainingType, { isLoading: loadingDelete }] =
    useDeleteTrainingTypeMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTrainingType(id);
        toast.success("Training Type deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createTrainingTypeHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo livro?")) {
      return;
    }
    try {
      await createTrainingType();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
          <h1>Treinos</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createTrainingTypeHandler} className="btn-sm m-3">
            <FaEdit />
            &nbsp; Criar Treino
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error.data.message}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome Treino</th>
                <th>Categoria</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.trainingTypes.map((trainingType) => (
                <tr key={trainingType._id}>
                  <td>{trainingType._id}</td>
                  <td>{trainingType.name}</td>
                  <td>{trainingType.category}</td>
                  <td>
                    <Link to={`/admin/trainingType/${trainingType._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(trainingType._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            <h2>Exemplos de Treinos</h2>
            <ul>
              <li>
                <h3>Treino de Perna (Lower Body Strength & Hypertrophy)</h3>
                <ul>
                  <li>
                    <h4>Treino A1 - Hipertrofia</h4>
                    <ol>
                      <li>Agachamento Livre – 4x 8-12</li>
                      <li>Leg Press – 3x 10-12</li>
                      <li>Afundo com Halteres – 3x 10 (cada perna)</li>
                      <li>Stiff com Barra – 3x 10-12</li>
                      <li>Cadeira Extensora – 3x 12-15</li>
                      <li>Panturrilha no Smith – 3x 15-20</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino A2 - Força</h4>
                    <ol>
                      <li>Agachamento Livre – 5x 5</li>
                      <li>Levantamento Terra – 4x 5-8</li>
                      <li>Passada com Barra – 3x 8 (cada perna)</li>
                      <li>Cadeira Flexora – 3x 10-12</li>
                      <li>Panturrilha no Leg Press – 4x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino A3 - Resistência</h4>
                    <ol>
                      <li>Agachamento Búlgaro – 3x 15</li>
                      <li>Avanço Alternado – 3x 12 (cada perna)</li>
                      <li>Stiff com Halteres – 3x 12-15</li>
                      <li>Elevação de Panturrilha Unilateral – 3x 15-20</li>
                      <li>Agachamento com Salto – 3x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino A4 - Foco em Glúteos e Posteriores</h4>
                    <ol>
                      <li>Levantamento Terra Romeno – 4x 10</li>
                      <li>Agachamento Sumo – 3x 12</li>
                      <li>Cadeira Flexora – 3x 12-15</li>
                      <li>Glúteo na Polia – 3x 12</li>
                      <li>Elevação Pélvica com Barra – 3x 10-12</li>
                    </ol>
                  </li>
                </ul>
              </li>
              <li>
                <hr />
                <h3>Treino de Braço (Bíceps e Tríceps)</h3>
                <ul>
                  <li>
                    <h4>Treino B1 - Hipertrofia</h4>
                    <ol>
                      <li>Rosca Direta com Barra – 4x 8-12</li>
                      <li>Rosca Martelo – 3x 10-12</li>
                      <li>Rosca Concentrada – 3x 12</li>
                      <li>Tríceps Corda no Pulley – 3x 12-15</li>
                      <li>Tríceps Francês – 3x 10-12</li>
                      <li>Fundos em Paralelas – 3x 8-12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino B2 - Força</h4>
                    <ol>
                      <li>Rosca Direta com Barra – 5x 5-8</li>
                      <li>Rosca Alternada com Halteres – 4x 10</li>
                      <li>Tríceps Testa – 4x 8-10</li>
                      <li>Paralelas com Peso – 3x 6-8</li>
                      <li>Rosca Martelo com Corda – 3x 10-12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino B3 - Resistência</h4>
                    <ol>
                      <li>Rosca Scott – 3x 12-15</li>
                      <li>Rosca Inversa – 3x 12-15</li>
                      <li>Tríceps Mergulho no Banco – 3x 15-20</li>
                      <li>Tríceps Pulley com Pegada Invertida – 3x 12-15</li>
                      <li>Rosca 21 – 3 séries</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino B4 - Bomba Final</h4>
                    <ol>
                      <li>Rosca Direta + Rosca Martelo – 3x 10</li>
                      <li>Tríceps Corda + Tríceps Testa – 3x 10-12</li>
                      <li>Rosca Alternada + Rosca Concentrada – 3x 10</li>
                      <li>Fundos em Paralelas – 3 séries até a falha</li>
                    </ol>
                  </li>
                </ul>
                <hr />
                <h3>Treino de Costas</h3>
                <ul>
                  <li>
                    <h4>Treino C1 - Hipertrofia</h4>
                    <ol>
                      <li>Puxada Frontal – 4x 8-12</li>
                      <li>Remada Curvada – 4x 10</li>
                      <li>Remada Unilateral – 3x 10</li>
                      <li>Pulldown na Polia – 3x 12</li>
                      <li>Levantamento Terra – 3x 8-10</li>
                      <li>Encolhimento de Ombros – 3x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino C2 - Força</h4>
                    <ol>
                      <li>Barra Fixa – 5x 6-8</li>
                      <li>Remada Cavalinho – 4x 8</li>
                      <li>Levantamento Terra – 4x 5</li>
                      <li>Remada Baixa na Polia – 3x 10</li>
                      <li>Face Pull – 3x 12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino C3 - Resistência</h4>
                    <ol>
                      <li>Puxada Pegada Fechada – 3x 12-15</li>
                      <li>Pullover com Halter – 3x 12-15</li>
                      <li>Remada com Halteres – 3x 12</li>
                      <li>Hiperextensão Lombar – 3x 15-20</li>
                      <li>Encolhimento com Halteres – 3x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino C4 - Misto</h4>
                    <ol>
                      <li>Puxada Pegada Aberta – 4x 10</li>
                      <li>Remada Baixa – 3x 12</li>
                      <li>Remada com Halter – 3x 10</li>
                      <li>Levantamento Terra Romeno – 3x 8</li>
                      <li>Face Pull – 3x 12</li>
                    </ol>
                  </li>
                </ul>
                <hr />
                <h3>Treino de Peito</h3>
                <ul>
                  <li>
                    <h4>Treino D1 - Hipertrofia</h4>
                    <ol>
                      <li>Supino Reto com Barra – 4x 8-12</li>
                      <li>Supino Inclinado com Halteres – 3x 10-12</li>
                      <li>Crucifixo com Halteres – 3x 12</li>
                      <li>Crossover – 3x 12-15</li>
                      <li>Flexões – 3 séries até a falha</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino D2 - Força</h4>
                    <ol>
                      <li>Supino Reto com Barra – 5x 5</li>
                      <li>Supino Fechado – 4x 8</li>
                      <li>Paralelas com Peso – 3x 6-8</li>
                      <li>Supino com Pegada Invertida – 3x 10</li>
                      <li>Flexão Diamante – 3x 12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino D3 - Resistência</h4>
                    <ol>
                      <li>Supino com Halteres – 3x 12-15</li>
                      <li>Crossover na Polia Alta – 3x 12-15</li>
                      <li>Crucifixo Inclinado – 3x 15</li>
                      <li>Flexão de Braço – 3 séries até a falha</li>
                      <li>Paralelas – 3x 12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino D4 - Pump Total</h4>
                    <ol>
                      <li>Supino Reto + Crossover – 3x 10</li>
                      <li>Supino Inclinado + Flexões – 3x 10-12</li>
                      <li>Paralelas + Crucifixo – 3x 12</li>
                      <li>Flexão até a falha</li>
                    </ol>
                  </li>
                </ul>

                <ul>
                  <li>
                    <h4>Treino E1 - Hipertrofia</h4>
                    <ol>
                      <li>Puxada Frontal – 4x 8-12</li>
                      <li>Remada Curvada – 4x 10</li>
                      <li>Remada Unilateral – 3x 10</li>
                      <li>Pulldown na Polia – 3x 12</li>
                      <li>Levantamento Terra – 3x 8-10</li>
                      <li>Encolhimento de Ombros – 3x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino E2 - Força</h4>
                    <ol>
                      <li>Barra Fixa – 5x 6-8</li>
                      <li>Remada Cavalinho – 4x 8</li>
                      <li>Levantamento Terra – 4x 5</li>
                      <li>Remada Baixa na Polia – 3x 10</li>
                      <li>Face Pull – 3x 12</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino E3 - Resistência</h4>
                    <ol>
                      <li>Puxada Pegada Fechada – 3x 12-15</li>
                      <li>Pullover com Halter – 3x 12-15</li>
                      <li>Remada com Halteres – 3x 12</li>
                      <li>Hiperextensão Lombar – 3x 15-20</li>
                      <li>Encolhimento com Halteres – 3x 15</li>
                    </ol>
                  </li>
                  <li>
                    <h4>Treino E4 - Misto</h4>
                    <ol>
                      <li>Puxada Pegada Aberta – 4x 10</li>
                      <li>Remada Baixa – 3x 12</li>
                      <li>Remada com Halter – 3x 10</li>
                      <li>Levantamento Terra Romeno – 3x 8</li>
                      <li>Face Pull – 3x 12</li>
                    </ol>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default TrainingTypeListScreen;
