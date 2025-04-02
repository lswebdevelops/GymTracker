import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Blog from '../models/blogModel.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const blog = {
      title: "New Blog",
      author: "Harry Wiese",
      image: "/uploads/newblogpost.jpg",
      content: "cinco anos de experiência como professor de língua portuguesa - do ensino fundamental até cursos de pós-graduação em diversas universidades. Pesquisador da história da colonização do Vale do Itajaí, em Santa Catarina. Autor dos livros Meu canto-amar; Girata de espantos; Nebusosa de amor: Contos e poemas de Natal; De Neu-Zürich a Presidente Getúlio: uma história de sucesso; A inserção da língua portuguesa na Colônia Hammonia, Terra da fartura: história da colonização de Ibirama e A sétima caverna. Graduado em Letras, especialista em Metodologia de Ensino e Mestre em Educação – Ensino Superior. É professor no Colégio São Paulo, de Ascurra e funcionário da UNIASSELVI de Indaial.",
    };

    await Blog.create(blog);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
