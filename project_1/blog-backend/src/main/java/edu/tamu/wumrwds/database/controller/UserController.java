package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.User;
import edu.tamu.wumrwds.database.entity.ext.UserExt;
import edu.tamu.wumrwds.database.entity.vo.Result;
import edu.tamu.wumrwds.database.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
import static javax.servlet.http.HttpServletResponse.SC_OK;

@RestController
@RequestMapping("user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Api(tags = "User API")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService service;

    @Value("${project.version}")
    private String version;

    @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Retrieves users by querying with specific keywords")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<? extends User>> getUsers(@RequestParam(name = "username", required = false) String username,
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
