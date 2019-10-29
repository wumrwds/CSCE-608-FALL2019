package edu.tamu.wumrwds.database.service.impl;

import edu.tamu.wumrwds.database.entity.Person;
import edu.tamu.wumrwds.database.mapper.PersonMapper;
import edu.tamu.wumrwds.database.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * User: query
 *
 * Article: query(Join username & category name)
 *
 * Article Detail: query/add(rich text)
 *
 * Comment: count comments for each article (group by & count)
 *          delete the articles with the least comments (delete & subquery)
 *
 * Category: count articles for each category (group by and aggregate)
 *
 *
 */
@Service
public class PersonServiceImpl implements PersonService {
    @Autowired
    private PersonMapper mapper;

    @Override
    public List<Person> findAll() {
        return mapper.findAll();
    }
}