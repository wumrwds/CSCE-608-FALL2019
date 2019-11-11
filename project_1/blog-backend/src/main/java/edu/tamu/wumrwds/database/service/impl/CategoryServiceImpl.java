package edu.tamu.wumrwds.database.service.impl;

import edu.tamu.wumrwds.database.mapper.CategoryMapper;
import edu.tamu.wumrwds.database.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryMapper mapper;

}