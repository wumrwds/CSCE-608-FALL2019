package edu.tamu.wumrwds.database.service;

import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ext.UserExt;

public interface UserService {
    PageInfo<UserExt> selectUsers(String username, Integer role);
}
