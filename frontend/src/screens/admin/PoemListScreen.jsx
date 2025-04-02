import React from "react";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import { useGetPoemsQuery, useCreatePoemMutation, useDeletePoemMutation } from "../../slices/poemsApiSlice";
import { toast } from "react-toastify";

const PoemListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetPoemsQuery({ pageNumber });
 

  const [createPoem, { isLoading: loadingCreate }] = useCreatePoemMutation();
  const [deletePoem, { isLoading: loadingDelete }] = useDeletePoemMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este poema?")) {
      try {
        await deletePoem(id);
        toast.success("Poema excluído com sucesso!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createPoemHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo poema?")) {
      return;
    }
    try {
      await createPoem();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Paginate
            pages={data?.pages}
            page={data?.page}
            isAdmin={true}
          />
          <h1>Poemas</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createPoemHandler} className="btn-sm m-3">
            <FaEdit />
            &nbsp; Criar Poema
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
      <th>ID</th>
      <th>Título</th>
      <th>Autor</th>
      <th>Conteúdo</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {data.map((poem) => (
      <tr key={poem._id}>
        <td>{poem._id}</td>
        <td>{poem.title}</td>
        <td>{poem.author}</td>
        <td>{poem.content.substring(0, 50)}...</td>
        <td>
          <Link to={`/admin/poem/${poem._id}/edit`}>
            <Button variant="light" className="btn-sm mx-2">
              <FaEdit />
            </Button>
          </Link>
          <Button
            variant="danger"
            className="btn-sm"
            onClick={() => deleteHandler(poem._id)}
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

export default PoemListScreen;
