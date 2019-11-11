package edu.tamu.wumrwds.database.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.tamu.wumrwds.database.entity.Person;
import edu.tamu.wumrwds.database.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("category")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CategoryController {
    @Autowired
    private PersonService service;

    @GetMapping(value = "/findAll")
    public List<Person> findAll(){
        List<Person> list = service.findAll();

        return list;
    }
}
