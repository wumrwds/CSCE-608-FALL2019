package edu.tamu.wumrwds.database.service;

import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.Article;
import edu.tamu.wumrwds.database.entity.ext.ArticleExt;

import java.util.List;

public interface ArticleService {
    PageInfo<ArticleExt> selectArticles(String username, Integer categoryId, int pageNum, int pageSize);

    int insertArticle(ArticleExt record);

    int deleteMostCommented();

    List<Article> selectIdByTitle(String title);
}
