import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCreatePoemMutation } from "../../slices/poemsApiSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const PoemCreateScreen = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  
  const [createPoem, { isLoading }] = useCreatePoemMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createPoem({ title, author, content });
      toast.success("Poema criado com sucesso!");
      navigate("/admin/poemlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Criar Poema</h1>
      {isLoading && <Loader />}
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
          Criar Poema
        </Button>
      </Form>
    </>
  );
};

export default PoemCreateScreen;
