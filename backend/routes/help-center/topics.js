const express = require('express');
const router = express.Router();
const Topic = require('../../models/help-center/topic');
const checkAuth = require('../../middleware/check-auth');
const multer = require('../../middleware/multer-config');
const fs = require('fs').promises;
const path = require('path');

// Rota para obter todos os tópicos
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();

    // Mapeie os tópicos para incluir a URL da imagem em cada um
    const topicsWithImageUrls = topics.map(topic => {
      return {
        ...topic._doc,
        imageUrl: topic.imagePath ? `http://localhost:3000/${topic.imagePath}` : null
      };
    });

    res.json(topicsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter detalhes de um tópico por ID
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic
      .findById(req.params.id)
      .populate({ path: 'sections', populate: { path: 'articles' } });

    if (!topic) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    // Inclua a URL da imagem na resposta
    const topicWithImageUrl = {
      ...topic._doc,
      imageUrl: topic.imagePath ? `http://localhost:3000/${topic.imagePath}` : null
    };

    res.json(topicWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo tópico
router.post('/', checkAuth, multer.single('image'), async (req, res) => {
  const topic = new Topic({
    name: req.body.name,
    imagePath: req.file ? req.file.path : null,
  });

  try {
    const newTopic = await topic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para atualizar um tópico por ID
router.put('/:id', checkAuth, multer.single('image'), async (req, res) => {
  try {
    const topicId = req.params.id;
    const updatedName = req.body.name;
    const newImage = req.file;

    const existingTopic = await Topic.findById(topicId);
    if (!existingTopic) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    // Se houver uma nova imagem, exclua a imagem antiga
    if (newImage && existingTopic.imagePath) {
      // Lógica para excluir a imagem antiga (use fs.unlink ou outra lógica conforme necessário)
      // ...

      // Atualize o caminho da imagem no banco de dados
      existingTopic.imagePath = newImage.path;
    }

    // Atualize o nome do tópico
    existingTopic.name = updatedName;

    const updatedTopic = await existingTopic.save();
    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Rota para excluir um tópico por ID
router.delete('/:id', checkAuth, async (req, res) => {
  try {
    // Obtém o tópico atual para recuperar o caminho da imagem antiga
    const existingTopic = await Topic.findById(req.params.id);

    // Se houver uma imagem antiga, exclua-a
    if (existingTopic && existingTopic.imagePath) {
      const oldImagePath = existingTopic.imagePath;

      // Extrai o nome do arquivo da URL da imagem antiga
      const fileName = path.basename(oldImagePath);

      // Construa o caminho completo da imagem antiga no sistema de arquivos
      const oldImagePathOnServer = path.join(__dirname, '../../uploads', fileName);

      // Verifique se o arquivo antigo realmente existe antes de tentar excluí-lo
      const isOldImageExist = await fs.access(oldImagePathOnServer)
        .then(() => true)
        .catch(() => false);

      if (isOldImageExist) {
        // Exclua a imagem antiga
        await fs.unlink(oldImagePathOnServer);
      }
    }

    // Exclua o tópico do banco de dados
    const deletedTopic = await Topic.findByIdAndDelete(req.params.id);

    if (!deletedTopic) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    res.json({ message: 'Tópico excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Rota para atualizar um tópico por ID com nova imagem e exclusão da imagem antiga
router.put('/:id/update-with-image', checkAuth, multer.single('image'), async (req, res) => {
  try {
    let imagePath = null;

    // Verifique se uma nova imagem foi enviada
    if (req.file) {
      // Construa o caminho completo da nova imagem
      imagePath = `uploads/${req.file.filename}`;
    }

    // Obtenha o tópico atual para recuperar o caminho da imagem antiga
    const existingTopic = await Topic.findById(req.params.id);

    // Se houver uma imagem antiga, exclua-a
    if (existingTopic && existingTopic.imagePath) {
      const oldImagePath = existingTopic.imagePath;

      // Extrai o nome do arquivo da URL da imagem antiga
      const fileName = path.basename(oldImagePath);

      // Construa o caminho completo da imagem antiga no sistema de arquivos
      const oldImagePathOnServer = path.join(__dirname, '../../uploads', fileName);

      // Verifique se o arquivo antigo realmente existe antes de tentar excluí-lo
      const isOldImageExist = await fs.access(oldImagePathOnServer)
        .then(() => true)
        .catch(() => false);

      if (isOldImageExist) {
        // Exclua a imagem antiga
        await fs.unlink(oldImagePathOnServer);
      }
    }

    // Atualize o tópico no banco de dados com o novo caminho da imagem
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      { 
        name: req.body.name,
        imagePath: imagePath
      },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ message: 'Tópico não encontrado' });
    }

    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
