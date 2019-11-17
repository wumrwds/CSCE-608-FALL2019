package edu.tamu.wumrwds.database.entity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

/**
 * Data transfer object for Comment service.
 *
 * @author wumrwds
 */
@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class CommentDTO implements Serializable {
    private static final long serialVersionUID = -6969968689945369799L;

    private Long articleId;

    private String title;

    private Integer count;

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "CommentDTO{" +
                "articleId=" + articleId +
                ", title='" + title + '\'' +
                ", count=" + count +
                '}';
    }
}
