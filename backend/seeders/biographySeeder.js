import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Biography from '../models/biographyModel.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const biography = {
      name: "Harry Wiese",
      bio: "Vasta experiência em revisão de textos (TCCs, monografias, dissertações, teses, artigos científicos, livros técnicos e de literatura). Quarenta e cinco anos de experiência como professor de língua portuguesa - do ensino fundamental até cursos de pós-graduação em diversas universidades. Pesquisador da história da colonização do Vale do Itajaí, em Santa Catarina. Autor dos livros Meu canto-amar; Girata de espantos; Nebusosa de amor: Contos e poemas de Natal; De Neu-Zürich a Presidente Getúlio: uma história de sucesso; A inserção da língua portuguesa na Colônia Hammonia, Terra da fartura: história da colonização de Ibirama e A sétima caverna. Graduado em Letras, especialista em Metodologia de Ensino e Mestre em Educação – Ensino Superior. É professor no Colégio São Paulo, de Ascurra e funcionário da UNIASSELVI de Indaial.",
      image: "/uploads/harryWiese.jpg",
    };

    await Biography.create(biography);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
