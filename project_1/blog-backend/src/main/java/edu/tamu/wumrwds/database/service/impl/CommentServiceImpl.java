package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
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
    public PageInfo<CommentExt> selectComments(String username, Long articleId) {

        PageHelper.startPage(1, 10);

        List<CommentExt> comments = mapper.selectComments(username, articleId);

        return new PageInfo<>(comments);
    }
}