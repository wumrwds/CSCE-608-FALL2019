package edu.tamu.wumrwds.database.service;

import edu.tamu.wumrwds.database.entity.Person;

import java.util.List;

public interface PersonService {
    List<Person> findAll();
}
