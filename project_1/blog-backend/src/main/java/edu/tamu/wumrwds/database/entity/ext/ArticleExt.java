package edu.tamu.wumrwds.database.entity.ext;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.entity.Article;

import java.io.Serializable;
import java.util.List;

/**
 * Article extended class.
 *
 * @author wumrwds
 */
@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class ArticleExt extends Article implements Serializable {

    private static final long serialVersionUID = 1349709633621463907L;

    private String username;

    private String categoryName;

    private List<Integer> categoryId;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<Integer> getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(List<Integer> categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public String toString() {
        return super.toString() + " ArticleExt{" +
                "username='" + username + '\'' +
                ", categoryName='" + categoryName + '\'' +
                ", categoryId='" + categoryId + '\'' +
                '}';
    }
}
