package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ArticleToCategory;
import edu.tamu.wumrwds.database.entity.ext.ArticleExt;
import edu.tamu.wumrwds.database.mapper.ArticleMapper;
import edu.tamu.wumrwds.database.mapper.ArticleToCategoryMapper;
import edu.tamu.wumrwds.database.mapper.CommentMapper;
import edu.tamu.wumrwds.database.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

/**
 * Article Service Implementation.
 *
 * @author wumrwds
 */
@Service
public class ArticleServiceImpl implements ArticleService {
    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private ArticleToCategoryMapper articleToCategoryMapper;

    @Autowired
    private CommentMapper commentMapper;


    @Override
    public PageInfo<ArticleExt> selectArticles(String username, Integer categoryId) {

        PageHelper.startPage(1, 10);

        List<ArticleExt> articles = articleMapper.selectArticles(username, categoryId);

        return new PageInfo<>(articles);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public int insertArticle(ArticleExt record) {

        int updatedRows1 = articleMapper.insert(record);

        if (updatedRows1 == 0) {
            throw new RuntimeException("Can not insert article record into database.");
        }

        List<ArticleToCategory> links = new LinkedList<>();
        for (Integer categoryId : record.getCategoryId()) {
            links.add(new ArticleToCategory(record.getId(), categoryId));
        }

        int updatedRows2 = articleToCategoryMapper.insertAll(links);

        return Math.min(updatedRows1, updatedRows2);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public int deleteMostCommented() {
        // retrieve the most commented article (top 1)
        Long articleId = articleMapper.selectMostCommented();

        if (articleId == null) {
            throw new IllegalStateException("No article can be deleted.");
        }

        // delete article
        int deleted1 = articleMapper.delete(articleId);

        // delete related comments
        commentMapper.deleteByArticleId(articleId);

        return deleted1;
    }
}