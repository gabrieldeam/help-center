const express = require('express');
const router = express.Router();
const Section = require('../../models/help-center/section');
const Topic = require('../../models/help-center/topic');
const Article = require('../../models/help-center/article');
const checkAuth = require('../../middleware/check-auth');

// Rota para obter informações da seção por ID
router.get('/:id', async (req, res) => {
  try {
      const section = await Section.findById(req.params.id);
      res.json(section);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Rota para obter todas as seções
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find().populate('topicId');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar uma nova seção
router.post('/', checkAuth, async (req, res) => {
  const section = new Section({
    name: req.body.name,
    topicId: req.body.topicId,
  });

  try {
    const newSection = await section.save();
    
    // Atualiza o tópico para incluir a nova seção
    await Topic.findByIdAndUpdate(req.body.topicId, { $push: { sections: newSection._id } });
    
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);

    if (!deletedSection) {
      return res.status(404).json({ message: 'Seção não encontrada' });
    }

    // Remove o ID da seção do array 'sections' no modelo 'Topic'
    await Topic.findByIdAndUpdate(deletedSection.topicId, { $pull: { sections: deletedSection._id } });

    res.json({ message: 'Seção excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  try {
    const sectionId = req.params.id;
    const { name, topicId: newTopicId } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Seção não encontrada' });
    }

    const oldTopicId = section.topicId;

    // Atualiza a seção
    section.name = name;
    section.topicId = newTopicId;
    const updatedSection = await section.save();

    // Remove o ID da seção do array 'sections' no modelo 'Topic' associado ao antigo 'topicId'
    if (oldTopicId) {
      const oldTopic = await Topic.findById(oldTopicId);
      if (oldTopic) {
        oldTopic.sections = oldTopic.sections.filter(s => s.toString() !== sectionId);
        await oldTopic.save();
      }
    }

    // Adiciona o ID da seção ao array 'sections' no modelo 'Topic' associado ao novo 'topicId'
    if (newTopicId) {
      const newTopic = await Topic.findById(newTopicId);
      if (newTopic) {
        newTopic.sections.push(sectionId);
        await newTopic.save();
      }
    }

    // Nova lógica para atualizar a associação de artigos
    if (oldTopicId && oldTopicId !== newTopicId) {
      const articles = await Article.find({ sectionId });
      for (const article of articles) {
        await Topic.updateOne({ _id: oldTopicId }, { $pull: { articles: article._id } });
        await Topic.updateOne({ _id: newTopicId }, { $addToSet: { articles: article._id } });
      }
    }

    res.json(updatedSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;