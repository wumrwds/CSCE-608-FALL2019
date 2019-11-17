package edu.tamu.wumrwds.database.service;

import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ext.CommentExt;

public interface CommentService {
    PageInfo<CommentExt> selectComments(String username, Long articleId);
}
