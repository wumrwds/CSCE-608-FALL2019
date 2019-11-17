package edu.tamu.wumrwds.database.entity.ext;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.entity.Comment;

import java.io.Serializable;

/**
 * Extended comment class.
 *
 * @author wumrwds
 */
@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class CommentExt extends Comment implements Serializable {
    private static final long serialVersionUID = 6335017222580433487L;

    private String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return super.toString() + " CommentExt{" +
                "title='" + title + '\'' +
                '}';
    }
}
