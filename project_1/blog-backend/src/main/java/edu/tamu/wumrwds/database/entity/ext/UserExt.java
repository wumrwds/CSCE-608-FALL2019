package edu.tamu.wumrwds.database.entity.ext;

import edu.tamu.wumrwds.database.entity.User;

public class UserExt extends User {
    private String roleName;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
