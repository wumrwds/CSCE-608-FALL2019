package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.Comment;
import edu.tamu.wumrwds.database.entity.ext.CommentExt;
import edu.tamu.wumrwds.database.entity.vo.Result;
import edu.tamu.wumrwds.database.service.CommentService;
import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
import static javax.servlet.http.HttpServletResponse.SC_OK;

@RestController
@RequestMapping("comment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Api(tags = "Comment API")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);


    @Autowired
    private CommentService service;

    @Value("${project.version}")
    private String version;

    @GetMapping(value = "/comment", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Retrieves comments by querying with specific keywords")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<? extends Comment>> getUsers(@RequestParam(name = "username", required = false)
                                                            @ApiParam(value = "User name") String username,
                                                        @RequestParam(name = "article_id", required = false)
                                                        @ApiParam(value = "Article ID") Long articleId) {

        try {
            PageInfo<CommentExt> comments = service.selectComments(username, articleId);

            return Result.buildOkResponse(comments, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }
}
