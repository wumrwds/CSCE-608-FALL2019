package edu.tamu.wumrwds.database.entity.ext;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.entity.Article;

import java.io.Serializable;

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

    @Override
    public String toString() {
        return super.toString() + " ArticleExt{" +
                "username='" + username + '\'' +
                ", categoryName='" + categoryName + '\'' +
                '}';
    }
}
