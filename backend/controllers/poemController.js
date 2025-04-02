import asyncHandler from "../middleware/asyncHandler.js";
import Poem from "../models/poemModel.js";

// @desc Fetch all poems
// @route GET /api/poems
// @access Public
const getPoems = asyncHandler(async (req, res) => {
  const poems = await Poem.find({})
  .sort({createdAt: -1})// sort them by newest first
  res.json(poems);
});

// @desc Fetch a poem by id
// @route GET /api/poems/:id
// @access Public
const getPoemById = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    res.json(poem);
  } else {
    res.status(404);
    throw new Error("Poem not found");
  }
});

// @desc Create a new poem
// @route POST /api/poems
// @access Private (admin only)
const createPoem = asyncHandler(async (req, res) => {
  const poem = new Poem({
    title: "Poema Amostra",       // Título do poema (valor padrão)
    author: "Harry Wiese",     // Autor do poema (valor padrão)
    content: `Tuas águas rolantes sobre o pétreo chão  
  São vestígios da longínqua nação,  
  Original.  
  Não desanimes, não chores  
  São ibiramares, irmão!  
  
  Não te constranjas, não te entristeças,  
  Tuas lutas ibiramares,  
  São cantares em construção.  
  
  O murmúrio dos ventos  
  Da Mirador gigante  
  E das montanhas circundantes.  
  
  Vem da distância que isola  
  São ibiramares transmudados em cantares,  
  Oração.  
  
  O meu povo  
  Nas lutas progressistas,  
  Não cultiva violências,  
  Nem discordâncias,  
  Constrói castelos singulares,  
  Como se fossem cantares.  
  
  Ah, são ibiramares,  
  Com perfeição!`,
    reviews: [],              // Reviews iniciais (vazio)
    rating: 0,                // Avaliação inicial
    numReviews: 0             // Número de avaliações
  });
  

  const createdPoem = await poem.save();
  res.status(201).json(createdPoem);
});


// @desc Update a poem
// @route PUT /api/poems/:id
// @access Private (admin only)
const updatePoem = asyncHandler(async (req, res) => {
  const { title, author, content } = req.body;

  const poem = await Poem.findById(req.params.id);

  if (poem) {
    poem.title = title || poem.title;
    poem.author = author || poem.author;
    poem.content = content || poem.content;

    const updatedPoem = await poem.save();
    res.json(updatedPoem);
  } else {
    res.status(404);
    throw new Error("Poem not found");
  }
});

// @desc Delete a poem
// @route DELETE /api/poems/:id
// @access Private (admin only)
const deletePoem = asyncHandler(async (req, res) => {
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    await Poem.deleteOne({ _id: poem._id });
    res.status(200).json({ message: "Poem deleted" });
  } else {
    res.status(404);
    throw new Error("Poem not found");
  }
});

// @desc Create a poem review
// @route POST /api/poems/:id/reviews
// @access Private (logged-in users)
const createPoemReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const poem = await Poem.findById(req.params.id);

  if (poem) {
    // Check if the user already reviewed the poem
    const alreadyReviewed = poem.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Poem already reviewed");
    }

    // Create new review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    poem.reviews.push(review);
    poem.numReviews = poem.reviews.length;

    // Update poem's average rating
    poem.rating =
      poem.reviews.reduce((acc, review) => acc + review.rating, 0) /
      poem.reviews.length;

    await poem.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Poem not found");
  }
});

// @desc Get top-rated poems
// @route GET /api/poems/top
// @access Public
const getTopPoems = asyncHandler(async (req, res) => {
  const poems = await Poem.find({})
    .sort({ rating: -1 })
    .limit(3);
  res.status(200).json(poems);
});

export {
  getPoems,
  getPoemById,
  createPoem,
  updatePoem,
  deletePoem,
  createPoemReview,
  getTopPoems,
};
