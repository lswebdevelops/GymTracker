import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Book = ({ book }) => {
  return (
    <Card className="my-3 p-3 rounded books-keyframe">
      <Link to={`/book/${book._id}`}></Link>
      <Card.Body>
        <Link to={`/book/${book._id}`}>
          <Card.Title
            as="div"
            className="book-title home-screen-training-inside-box"
          >
            <strong>{book.name}</strong>
            <hr />
            <strong>{book.category}</strong> {" - "}
            <strong>{book.brand}</strong>
            <hr />
            <p>{book.description}</p>
          </Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Book;
