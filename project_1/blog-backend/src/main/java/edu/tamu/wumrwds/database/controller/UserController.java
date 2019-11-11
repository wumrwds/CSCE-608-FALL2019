package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.User;
import edu.tamu.wumrwds.database.entity.ext.UserExt;
import edu.tamu.wumrwds.database.entity.vo.Result;
import edu.tamu.wumrwds.database.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService service;

    @Value("${project.version}")
    private String version;

    @GetMapping(value = "/userList", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Result<PageInfo<? extends User>> getUserList(@RequestParam(name = "username", required = false) String username,
                                                        @RequestParam(name = "roleId", required = false) Integer roleId) {

        try {
            PageInfo<UserExt> users = service.selectUsers(username, roleId);

            return Result.buildOkResponse(users, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }
}
