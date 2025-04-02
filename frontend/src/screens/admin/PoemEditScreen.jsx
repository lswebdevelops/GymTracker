import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPoemDetailsQuery } from "../../slices/poemsApiSlice"; 
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useUpdatePoemMutation } from "../../slices/poemsApiSlice";

const PoemEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Use `refetch` to manually trigger the refetch of poem details
  const { data: poem, isLoading, error, refetch } = useGetPoemDetailsQuery(id);
  const [updatePoem, { isLoading: loadingUpdate }] = useUpdatePoemMutation();
  
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (poem) {
      setTitle(poem.title);
      setAuthor(poem.author);
      setContent(poem.content);
    }
  }, [poem]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updatePoem({ id, title, author, content });
      toast.success("Poema atualizado com sucesso!");
      refetch();  // Force re-fetch to get updated data
      navigate("/admin/poemlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Editar Poema</h1>
      {isLoading || loadingUpdate ? <Loader /> : error ? <Message>{error.data.message}</Message> : (
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="title" className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o título do poema"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="author" className="mb-3">
                <Form.Label>Autor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome do autor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="content" className="mb-3">
            <Form.Label>Conteúdo</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Escreva o conteúdo do poema"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Atualizar Poema
          </Button>
        </Form>
      )}
    </>
  );
};

export default PoemEditScreen;
