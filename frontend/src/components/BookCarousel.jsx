import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Message from "./Message";
import { useGetTopBooksQuery } from "../slices/booksApiSlice";

const BookCarousel = () => {
  const { data: books, isLoading, error } = useGetTopBooksQuery();

  return isLoading ? null : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-light mb-4 caroulsel-book-right-side">
      {books.map((book) => (
        <Carousel.Item key={book._id}>
          <Link         
          
          to={`/book/${book._id}`}>
            <div 
              style={{
                height: "400px",
                width: "100%",
                position: "relative",
                backgroundColor: "#f8f9fa",
                backgroundImage: `url(${book.image})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div
             
                style={{
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.5)", // White overlay with 50% transparency
                  zIndex: 0,
                }}
              ></div>
              <Image
               
                src={book.image}
                alt={book.name}
                fluid
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>

            <Carousel.Caption className="carousel-caption carousel-letters-container">
              <h2 className="text-white text-right carousel-letters">
                {book.name}
                {/* (R$&nbsp;{book.price}) */}
                <br />
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BookCarousel;
