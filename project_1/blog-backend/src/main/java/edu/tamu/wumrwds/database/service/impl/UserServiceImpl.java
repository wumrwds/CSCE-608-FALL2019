package edu.tamu.wumrwds.database.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.ext.UserExt;
import edu.tamu.wumrwds.database.mapper.UserMapper;
import edu.tamu.wumrwds.database.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * User service implementation.
 *
 * @author wumrwds
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper mapper;

    @Override
    public PageInfo<UserExt> selectUsers(String username, Integer roleId, int pageNum, int pageSize) {

        PageHelper.startPage(pageNum, pageSize);

        List<UserExt> users = mapper.selectUsers(username, roleId);

        return new PageInfo(users);
    }
}