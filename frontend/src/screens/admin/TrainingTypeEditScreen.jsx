import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateTrainingTypeMutation,
  useGetTrainingTypeDetailsQuery,
  useUploadTrainingTypeImageMutation,
} from "../../slices/trainingTypesApiSlice";

const TrainingTypeEditScreen = () => {
  const { id: trainingTypeId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const { data: trainingType, isLoading, error } = useGetTrainingTypeDetailsQuery(trainingTypeId);

  const [updateTrainingType, { isLoading: loadingUpdate }] = useUpdateTrainingTypeMutation();

  const [uploadTrainingTypeImage, { isLoading: loadingUpload }] =
    useUploadTrainingTypeImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (trainingType) {
      setName(trainingType.name);
      setPrice(trainingType.price);
      setImage(trainingType.image);
      setBrand(trainingType.brand);
      setCategory(trainingType.category);
      setCountInStock(trainingType.countInStock);
      setDescription(trainingType.description);
    }
  }, [trainingType]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedTrainingType = {
      trainingTypeId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateTrainingType(updatedTrainingType);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Training Type updated");
      navigate("/admin/trainingTypelist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadTrainingTypeImage(formData).unwrap();
      toast.success(res.message);

      // Normalize the path to always use forward slashes
      const imageUrl = res.image.replace(/\\/g, "/");
      setImage(imageUrl); // Set the normalized image URL
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/trainingTypelist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Treino</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Treino</Form.Label>
              <Form.Control
                as="select"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
                {[
                  "A1",
                  "A2",
                  "A3",
                  "A4",
                  "A5",
                  "B1",
                  "B2",
                  "B3",
                  "B4",
                  "B5",
                  "C1",
                  "C2",
                  "C3",
                  "C4",
                  "C5",
                  "D1",
                  "D2",
                  "D3",
                  "D4",
                  "D5",
                  "E1",
                  "E2",
                  "E3",
                  "E4",
                  "E5",
                  "F1",
                  "F2",
                  "F3",
                  "F4",
                  "F5",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

           

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Grupo Muscular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do Grupo Muscular"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Exercícios</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={15}
                placeholder="Adicione os exercícios"
                value={description}
                maxLength="2000"
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Salvar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default TrainingTypeEditScreen;
