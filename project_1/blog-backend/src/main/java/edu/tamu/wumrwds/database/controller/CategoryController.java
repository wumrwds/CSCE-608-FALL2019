package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.pagehelper.PageInfo;
import edu.tamu.wumrwds.database.entity.dto.CategoryDTO;
import edu.tamu.wumrwds.database.entity.vo.Result;
import edu.tamu.wumrwds.database.service.CategoryService;
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
@RequestMapping("category")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Api(tags = "Category API")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private CategoryService service;

    @Value("${project.version}")
    private String version;

    @GetMapping(value = "avg-count", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @ApiOperation(value = "Counts the average comments amount per article for each category")
    @ApiResponses(value = { @ApiResponse(code = SC_OK, message = "ok"),
            @ApiResponse(code = SC_INTERNAL_SERVER_ERROR, message = "An unexpected error occurred")
    })
    public Result<PageInfo<CategoryDTO>> getAvgCounts(@RequestParam(name = "page", defaultValue = "1", required = false)
                                                      @ApiParam("page number") int pageNum,
                                                      @RequestParam(name = "size", defaultValue = "10", required = false)
                                                      @ApiParam("page size") int pageSize) {

        try {
            PageInfo<CategoryDTO> avgCommentCounts = service.selectAvgCommentCount(pageNum, pageSize);

            return Result.buildOkResponse(avgCommentCounts, version);
        } catch (Exception e) {
            logger.error("*** Unexpected Exception: e = {} ***", e);

            return Result.buildErrorResponse("500", e.getMessage(), version);
        }
    }
}
