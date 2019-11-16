package edu.tamu.wumrwds.database.entity.ext;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.entity.User;

import java.io.Serializable;

@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class UserExt extends User implements Serializable {

    private static final long serialVersionUID = 1828476411762698951L;

    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
