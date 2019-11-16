package edu.tamu.wumrwds.database.service;

import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ext.ArticleExt;

public interface ArticleService {
    PageInfo<ArticleExt> selectArticles(String username, Integer categoryId);
}
