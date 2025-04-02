import books from "../bookData.js";

const UpcomingScreen = () => {
  return (
    <div className="div-container-projects">
{books.map((book) => (
      <div key={book.id} className="div-projects">
        {book.id !== 1 && <hr />}

        <h1 className="h1-upcoming">Projetos</h1>
        <h2 className="h2-upcoming">Contos</h2>
        <div className="project-container upcoming-container">
        <div id="div-image-upcoming">
            <img
              className="image-upcoming"
              src={book.image}
              alt="`cover of ${book.title}"
            />
          </div>
          <div className="div-text-container-upcoming">
            <h3 className="h3-upcoming">{book.title}</h3>
            <h4 className="h4-upcoming">Data de lançamento{book.releaseDate}</h4>
            <div className="div-parag">
              <p className="upcoming-para">{book.description}</p>
            </div>

            <a href="https://www.mercadolivre.com.br/" target="__blank">
              Reserve sua Cópia
            </a>
          </div>
        </div>
      </div>      
      ))}
    </div>
  );
};

export default UpcomingScreen;
