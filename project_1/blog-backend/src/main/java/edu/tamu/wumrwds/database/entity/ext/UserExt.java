package edu.tamu.wumrwds.database.entity.ext;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.tamu.wumrwds.database.entity.User;

@JsonInclude(
        JsonInclude.Include.NON_NULL
)
public class UserExt extends User {
    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
