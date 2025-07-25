import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from '../config/db.js';
import TrainingType from '../models/trainingTypeModel.js';
import User from '../models/userModel.js';

dotenv.config();
await connectDB();

const trainingTypes = [
  // A – Pernas
  { name: 'A1', category: 'Pernas', description: 'Agachamento livre\nLeg press\nCadeira extensora\nCadeira flexora\nPanturrilha em pé' },
  { name: 'A2', category: 'Pernas', description: 'Agachamento sumô\nAvanço com halteres\nCadeira abdutora\nPanturrilha sentada\nAgachamento búlgaro' },
  { name: 'A3', category: 'Pernas', description: 'Stiff com halteres\nLevantamento terra romeno\nGlúteo na máquina\nCadeira adutora\nMesa flexora' },
  { name: 'A4', category: 'Pernas', description: 'Agachamento no Smith\nPassada no step\nPanturrilha no leg\nCadeira flexora unilateral\nExtensora com pausa' },
  { name: 'A5', category: 'Pernas', description: 'Hack machine\nAgachamento frontal\nAfundo com barra\nElevação de quadril\nFlexora 21' },

  // B – Costas
  { name: 'B1', category: 'Costas', description: 'Puxada frente\nRemada baixa\nPullover no cabo\nBarra fixa\nRemada curvada com barra' },
  { name: 'B2', category: 'Costas', description: 'Remada unilateral\nPulldown com triângulo\nLevantamento terra\nRemada cavalinho\nPuxada atrás' },
  { name: 'B3', category: 'Costas', description: 'Remada serrote\nRemada na máquina Hammer\nFace pull\nPull-over com halteres\nPuxada neutra' },
  { name: 'B4', category: 'Costas', description: 'Remada T-bar\nRemada invertida\nPulldown unilateral\nBarra fixa com pegada aberta\nRemada no Smith' },
  { name: 'B5', category: 'Costas', description: 'Remada sentada com corda\nPuxada pronada\nRemada supinada\nPullover na máquina\nBarra com pegada fechada' },

  // C – Peito
  { name: 'C1', category: 'Peito', description: 'Supino reto\nSupino inclinado\nCrucifixo reto\nCrossover\nFlexão' },
  { name: 'C2', category: 'Peito', description: 'Supino com halteres\nSupino declinado\nCrucifixo inclinado\nPeck deck\nPullover com halteres' },
  { name: 'C3', category: 'Peito', description: 'Crucifixo com cabo\nSupino máquina\nFlexão com pés elevados\nCrossover unilateral\nPress inclinado' },
  { name: 'C4', category: 'Peito', description: 'Press declinado no Smith\nSupino alternado\nCrucifixo máquina\nPeck deck unilateral\nFlexão diamante' },
  { name: 'C5', category: 'Peito', description: 'Press com pega neutra\nCrucifixo no cross\nPush-up com halteres\nPress com elástico\nCrossover inclinado' },

  // D – Ombros
  { name: 'D1', category: 'Ombros', description: 'Desenvolvimento com halteres\nElevação lateral\nRemada alta\nEncolhimento\nCrucifixo invertido' },
  { name: 'D2', category: 'Ombros', description: 'Desenvolvimento no Smith\nElevação frontal\nFace pull\nRemada baixa no cabo\nDesenvolvimento Arnold' },
  { name: 'D3', category: 'Ombros', description: 'Crucifixo inverso\nEncolhimento com barra\nElevação lateral inclinada\nRemada unilateral\nDesenvolvimento militar' },
  { name: 'D4', category: 'Ombros', description: 'Elevação 21\nRemada no cross\nDesenvolvimento alternado\nEncolhimento com halteres\nElevação no cabo' },
  { name: 'D5', category: 'Ombros', description: 'Desenvolvimento com kettlebell\nCrucifixo máquina\nRemada pegada aberta\nElevação lateral com isometria\nFace pull com corda' },

  // E – Braços
  { name: 'E1', category: 'Braços', description: 'Rosca direta\nTríceps pulley\nRosca martelo\nTríceps testa\nRosca concentrada' },
  { name: 'E2', category: 'Braços', description: 'Rosca Scott\nTríceps corda\nRosca inversa\nTríceps banco\nRosca alternada' },
  { name: 'E3', category: 'Braços', description: 'Rosca 21\nTríceps francês\nRosca no cabo\nTríceps unilateral\nRosca com barra EZ' },
  { name: 'E4', category: 'Braços', description: 'Tríceps coice\nRosca com resistência elástica\nTríceps máquina\nRosca Zottman\nRosca martelo cruzada' },
  { name: 'E5', category: 'Braços', description: 'Rosca concentrada sentado\nTríceps na testa com halteres\nRosca no banco inclinado\nTríceps cruzado no cabo\nRosca direta com isometria' },

  // F – Abdômen
  { name: 'F1', category: 'Abdômen', description: 'Prancha\nAbdominal supra\nAbdominal infra\nElevação de pernas\nAbdominal na bola' },
  { name: 'F2', category: 'Abdômen', description: 'Prancha lateral\nAbdominal bicicleta\nAbdominal oblíquo\nAbdominal com carga\nPrancha com elevação' },
  { name: 'F3', category: 'Abdômen', description: 'Prancha com braço estendido\nElevação de joelhos\nAbdominal na prancha inclinada\nAbdominal máquina\nTwist russo' },
  { name: 'F4', category: 'Abdômen', description: 'Abdominal invertido\nAbdominal V-up\nPrancha com instabilidade\nElevação de pernas com peso\nCrunch com bola suíça' },
  { name: 'F5', category: 'Abdômen', description: 'Mountain climber\nAbdominal com polia alta\nPrancha com halteres\nCrunch cruzado\nElevação suspensa' },
];

const importTrainingTypes = async () => {
  try {
    await TrainingType.deleteMany();
    const user = await User.findOne({ isAdmin: true });

    if (!user) {
      console.log('Admin user not found'.red.inverse);
      process.exit(1);
    }

    const trainingTypesWithUser = trainingTypes.map((t) => ({
      ...t,
      user: user._id,
    }));

    await TrainingType.insertMany(trainingTypesWithUser);
    console.log('Training types seeded!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importTrainingTypes();
