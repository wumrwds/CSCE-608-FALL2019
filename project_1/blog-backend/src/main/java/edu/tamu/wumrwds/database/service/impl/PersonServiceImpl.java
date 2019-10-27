package edu.tamu.wumrwds.database.service.impl;

import edu.tamu.wumrwds.database.entity.Person;
import edu.tamu.wumrwds.database.mapper.PersonMapper;
import edu.tamu.wumrwds.database.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonServiceImpl implements PersonService {
    @Autowired
    private PersonMapper mapper;

    @Override
    public List<Person> findAll() {
        return mapper.findAll();
    }
}