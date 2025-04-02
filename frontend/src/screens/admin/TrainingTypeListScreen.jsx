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
  const { data, isLoading, error, refetch } = useGetTrainingTypesQuery({ pageNumber });

  const [createTrainingType, { isLoading: loadingCreate }] = useCreateTrainingTypeMutation();

  const [deleteTrainingType, { isLoading: loadingDelete }] = useDeleteTrainingTypeMutation();

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
                {/* <td>Coleção</td> */}
                <th>Categoria</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.trainingTypes.map((trainingType) => (
                <tr key={trainingType._id}>
                  <td>{trainingType._id}</td>
                  <td>{trainingType.name}</td>
                  {/* <td>{trainingType.brand}</td> */}
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
        </>
      )}
    </>
  );
};

export default TrainingTypeListScreen;
