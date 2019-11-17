package edu.tamu.wumrwds.database.mapper;

import edu.tamu.wumrwds.database.entity.Comment;
import edu.tamu.wumrwds.database.entity.ext.CommentExt;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table tt_comment
     *
     * @mbg.generated
     */
    Comment selectByPrimaryKey(Long id);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table tt_comment
     *
     * @mbg.generated
     */
    List<Comment> selectAll();

    List<CommentExt> selectComments(String username, Long articleId);
}