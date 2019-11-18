package edu.tamu.wumrwds.database.entity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

/**
 * Data transfer object for Category service.
 *
 * @author wumrwds
 */
@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class CategoryDTO implements Serializable {
    private static final long serialVersionUID = -2019194755514273339L;

    private Integer categoryId;

    private String categoryName;

    private Double avgCount;

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Double getAvgCount() {
        return avgCount;
    }

    public void setAvgCount(Double avgCount) {
        this.avgCount = avgCount;
    }

    @Override
    public String toString() {
        return "CategoryDTO{" +
                "categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", avgCount=" + avgCount +
                '}';
    }
}
