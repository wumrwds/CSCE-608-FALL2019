package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.User;
import edu.tamu.wumrwds.database.entity.ext.UserExt;
import edu.tamu.wumrwds.database.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping(value = "/userList", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody PageInfo<? extends User> getUserList(@RequestParam(name = "username", required = false) String username,
                                         @RequestParam(name = "roleId", required = false) Integer roleId){

        PageInfo<UserExt> users = service.selectUsers(username, roleId);

        return users;
    }
}
