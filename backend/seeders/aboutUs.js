import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Biography from '../models/aboutUsModel.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const biography = {
      name: "Gym Tracker",
      bio: `# Sobre Nós - Gym Tracker

      Nossa Missão
      
      No Gym Tracker, acreditamos que acompanhar os treinos deve ser algo simples, intuitivo e eficiente. Nosso objetivo é oferecer uma experiência perfeita para entusiastas do fitness e academias, ajudando-os a organizar e seguir suas rotinas de exercícios com facilidade.
      
      O Que Fazemos
      
      O Gym Tracker é um aplicativo moderno de acompanhamento de treinos, projetado para ajudar os usuários a criar, gerenciar e seguir suas coleções de exercícios. Seja você um indivíduo buscando consistência ou um dono de academia oferecendo programas estruturados, nossa plataforma facilita o planejamento, o acompanhamento e o progresso.
      
      Por Que Escolher o Gym Tracker?
      
      Design Centrado no Usuário: Focamos na simplicidade e funcionalidade para garantir uma experiência sem complicações.
      
      Treinos Personalizados: Os usuários podem criar suas próprias coleções de exercícios adaptadas aos seus objetivos de fitness.
      
      Controle Administrativo: Administradores de academias podem fornecer rotinas de treino predefinidas para seus membros.
      
      Agendamento Automático: O aplicativo organiza automaticamente os treinos para manter os usuários no caminho certo.
      
      Seguro e Confiável: Desenvolvido com React e Node.js, garantindo alto desempenho e segurança dos dados.
      
      Junte-se a Nós
      
      Seja você um dono de academia ou um entusiasta do fitness, o Gym Tracker está aqui para ajudá-lo a se manter organizado e comprometido com seus treinos. Comece hoje mesmo e leve seu treinamento para o próximo nível!`,
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
