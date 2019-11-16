package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ext.ArticleExt;
import edu.tamu.wumrwds.database.mapper.ArticleMapper;
import edu.tamu.wumrwds.database.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Article Service Implementation.
 *
 * @author wumrwds
 */
@Service
public class ArticleServiceImpl implements ArticleService {
    @Autowired
    private ArticleMapper mapper;


    @Override
    public PageInfo<ArticleExt> selectArticles(String username, Integer categoryId) {

        PageHelper.startPage(1, 10);

        List<ArticleExt> articles = mapper.selectArticles(username, categoryId);

        return new PageInfo<>(articles);
    }
}