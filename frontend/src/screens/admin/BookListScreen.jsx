import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
} from "../../slices/booksApiSlice";
import { toast } from "react-toastify";

const BookListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetBooksQuery({ pageNumber });

  const [createBook, { isLoading: loadingCreate }] = useCreateBookMutation();

  const [deleteBook, { isLoading: loadingDelete }] = useDeleteBookMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteBook(id);
        toast.success("Book deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createBookHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo livro?")) {
      return;
    }
    try {
      await createBook();
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
          <Button onClick={createBookHandler} className="btn-sm m-3">
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
              {data.books.map((book) => (
                <tr key={book._id}>
                  <td>{book._id}</td>
                  <td>{book.name}</td>
                  {/* <td>{book.brand}</td> */}
                  <td>{book.category}</td>

                  <td>
                    <Link to={`/admin/book/${book._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(book._id)}
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

export default BookListScreen;
