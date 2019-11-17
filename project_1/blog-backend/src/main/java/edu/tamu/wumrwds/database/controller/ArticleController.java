package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.Article;
import edu.tamu.wumrwds.database.entity.ext.ArticleExt;
import edu.tamu.wumrwds.database.entity.vo.Result;
import edu.tamu.wumrwds.database.service.ArticleService;
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
@RequestMapping("article")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Api(tags = "Article API")
public class ArticleController {

    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);

    @Autowired
    private ArticleService service;

    @Value("${project.version}")
    private String version;

    @GetMapping(value = "/article", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Retrieves articles by querying with specific keywords")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<? extends Article>> getArticle(@RequestParam(name = "username", required = false)
                                                              @ApiParam(value = "User name") String username,
                                                        @RequestParam(name = "category_id", required = false)
                                                        @ApiParam(value = "category ID") Integer categoryId) {

        try {
            PageInfo<ArticleExt> articles = service.selectArticles(username, categoryId);

            return Result.buildOkResponse(articles, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }

    @PostMapping(value = "/article", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Create a new article and insert it into the database")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<Integer> getUsers(@RequestBody @ApiParam(value = "A JSON value representing a article record.",
            example = "{\"userId\":5,\"title\":\"Test Article #1\",\"description\":\"This is a test article\",\"body\":\"Test test test test test test.\",\"categoryId\":[1,3,5,7]}")
                                                ArticleExt record) {
        try {

            int updated = service.insertArticle(record);

            return Result.buildOkResponse(updated, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }


}
