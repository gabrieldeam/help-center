const express = require('express');
const router = express.Router();
const Article = require('../../models/help-center/article');
const Topic = require('../../models/help-center/topic');
const Section = require('../../models/help-center/section');
const checkAuth = require('../../middleware/check-auth');

// Rota para obter todos os artigos
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate({ path: 'sectionId', populate: { path: 'topicId' } });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para buscar artigos com base em um termo de pesquisa
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q;

  try {
    // Use uma expressão regular para permitir pesquisa parcial
    const regex = new RegExp(searchTerm, 'i');
    
    // Lógica para buscar artigos com base em searchTerm
    const articles = await Article.find({
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter um artigo pelo ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate({ path: 'sectionId', populate: { path: 'topicId' } });

    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    // Certifique-se de que sectionId e topicId existam
    if (article.sectionId && article.sectionId.topicId && article.sectionId.topicId.imagePath) {
      // Adicione o endereço do servidor ao caminho da imagem
      article.sectionId.topicId.imagePath = `http://localhost:3000/${article.sectionId.topicId.imagePath}`;
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo artigo
router.post('/', checkAuth, async (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    useful: req.body.useful,
    sectionId: req.body.sectionId,
  });

  try {
    const newArticle = await article.save();

    // Atualiza a seção associada com o novo artigo
    await Section.findByIdAndUpdate(req.body.sectionId, { $push: { articles: newArticle._id } });

    // Obtém o tópico associado à seção
    const section = await Section.findById(req.body.sectionId);
    
    // Atualiza o tópico associado com o novo artigo
    await Topic.findByIdAndUpdate(section.topicId, { $push: { articles: newArticle._id } });
    
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    // Remove o ID do artigo da lista de artigos associados à seção
    await Section.updateOne({ _id: deletedArticle.sectionId }, { $pull: { articles: req.params.id } });

    // Obtém o ID do tópico associado à seção
    const section = await Section.findById(deletedArticle.sectionId);
    
    // Remove o ID do artigo da lista de artigos associados ao tópico
    await Topic.updateOne({ _id: section.topicId }, { $pull: { articles: req.params.id } });

    res.json({ message: 'Artigo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', checkAuth, async (req, res) => {
  try {
    const articleId = req.params.id;
    const { title, content, useful, sectionId: newSectionId } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado' });
    }

    const oldSectionId = article.sectionId;

    // Atualiza o artigo
    article.title = title;
    article.content = content;
    article.useful = useful;
    article.sectionId = newSectionId;
    const updatedArticle = await article.save();

    // Remove o ID do artigo do array 'articles' no modelo 'Section' associado à antiga 'sectionId'
    if (oldSectionId) {
      const oldSection = await Section.findById(oldSectionId);
      if (oldSection) {
        oldSection.articles = oldSection.articles.filter(a => a.toString() !== articleId);
        await oldSection.save();

        // Remove o ID do artigo do array 'articles' no modelo 'Topic' associado à 'topicId' da antiga 'sectionId'
        if (oldSection.topicId) {
          const oldTopic = await Topic.findById(oldSection.topicId);
          if (oldTopic) {
            oldTopic.articles = oldTopic.articles ? oldTopic.articles.filter(a => a.toString() !== articleId) : [];
            await oldTopic.save();
          }
        }
      }
    }

    // Adiciona o ID do artigo ao array 'articles' no modelo 'Section' associado à nova 'sectionId'
    if (newSectionId) {
      const newSection = await Section.findById(newSectionId);
      if (newSection) {
        newSection.articles.push(articleId);
        await newSection.save();

        // Adiciona o ID do artigo ao array 'articles' no modelo 'Topic' associado à 'topicId' da nova 'sectionId'
        const newTopic = await Topic.findById(newSection.topicId);
        if (newTopic) {
          newTopic.articles.push(articleId);
          await newTopic.save();
        }
      }
    }

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;