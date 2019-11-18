package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.Comment;
import edu.tamu.wumrwds.database.entity.dto.CommentDTO;
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

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Retrieves comments by querying with specific keywords")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<? extends Comment>> getComments(@RequestParam(name = "username", required = false)
                                                            @ApiParam(value = "User name") String username,
                                                        @RequestParam(name = "article_id", required = false)
                                                        @ApiParam(value = "Article ID") Long articleId,
                                                        @RequestParam(name = "page", defaultValue = "1", required = false)
                                                        @ApiParam("page number") int pageNum,
                                                        @RequestParam(name = "size", defaultValue = "10", required = false)
                                                        @ApiParam("page size") int pageSize) {

        try {
            PageInfo<CommentExt> comments = service.selectComments(username, articleId, pageNum, pageSize);

            return Result.buildOkResponse(comments, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }

    @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Create a new comment on the selected article")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<Integer> createComment(@RequestBody @ApiParam(value = "A JSON value representing a comment record.",
            example = "{\"userId\":0,\"username\":\"rlskkcrkxwolplnvctbh\",\"articleId\":3004,\"content\":\"test content #1\"}")
                                            Comment record) {
        try {

            int updated = service.insertComment(record);

            return Result.buildOkResponse(updated, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }

    @GetMapping(value = "/count", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Count comments by the specific keyword")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<CommentDTO>> getCount(@RequestParam(name = "article_id", required = false)
                                                 @ApiParam(value = "Article ID") Long articleId,
                                                 @RequestParam(name = "page", defaultValue = "1", required = false)
                                                 @ApiParam("page number") int pageNum,
                                                 @RequestParam(name = "size", defaultValue = "10", required = false)
                                                 @ApiParam("page size") int pageSize) {

        try {
            PageInfo<CommentDTO> count = service.selectCountByArticle(articleId, pageNum, pageSize);

            return Result.buildOkResponse(count, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }
}
