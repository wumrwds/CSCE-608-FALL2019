package edu.tamu.wumrwds.database.service;

import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.dto.CategoryDTO;

public interface CategoryService {
    PageInfo<CategoryDTO> selectAvgCommentCount(int pageNum, int pageSize);
}
