package edu.tamu.wumrwds.database.service.impl;

import edu.tamu.wumrwds.database.mapper.CommentMapper;
import edu.tamu.wumrwds.database.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentMapper mapper;

}