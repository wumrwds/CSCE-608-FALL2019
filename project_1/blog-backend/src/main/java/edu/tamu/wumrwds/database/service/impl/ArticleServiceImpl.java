package edu.tamu.wumrwds.database.service.impl;

import edu.tamu.wumrwds.database.mapper.ArticleMapper;
import edu.tamu.wumrwds.database.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class ArticleServiceImpl implements ArticleService {
    @Autowired
    private ArticleMapper mapper;


}