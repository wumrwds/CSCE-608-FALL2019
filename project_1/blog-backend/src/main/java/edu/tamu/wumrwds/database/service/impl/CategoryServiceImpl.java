package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.dto.CategoryDTO;
import edu.tamu.wumrwds.database.mapper.CategoryMapper;
import edu.tamu.wumrwds.database.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 */
@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryMapper mapper;

    @Override
    public PageInfo<CategoryDTO> selectAvgCommentCount(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<CategoryDTO> avgCommentCounts = mapper.selectAvgCommentCount();

        return new PageInfo(avgCommentCounts);
    }
}