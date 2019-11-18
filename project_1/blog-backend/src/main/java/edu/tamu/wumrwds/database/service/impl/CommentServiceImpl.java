package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.Comment;
import edu.tamu.wumrwds.database.entity.dto.CommentDTO;
import edu.tamu.wumrwds.database.entity.ext.CommentExt;
import edu.tamu.wumrwds.database.mapper.CommentMapper;
import edu.tamu.wumrwds.database.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Comment service implementation.
 *
 * @author wumrwds
 */
@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentMapper mapper;

    @Override
    public PageInfo<CommentExt> selectComments(String username, Long articleId, int pageNum, int pageSize) {

        PageHelper.startPage(pageNum, pageSize);

        List<CommentExt> comments = mapper.selectComments(username, articleId);

        return new PageInfo<>(comments);
    }

    @Override
    public PageInfo<CommentDTO> selectCountByArticle(Long articleId, int pageNum, int pageSize) {

        PageHelper.startPage(pageNum, pageSize);

        List<CommentDTO> counts = mapper.selectCountByArticle(articleId);

        return new PageInfo<>(counts);
    }

    @Override
    public int insertComment(Comment record) {
        int updated = mapper.insert(record);
        if (updated == 0) {
            throw new RuntimeException("Can not insert comment record into database.");
        }

        return updated;
    }
}