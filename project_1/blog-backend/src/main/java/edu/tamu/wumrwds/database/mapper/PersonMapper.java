package edu.tamu.wumrwds.database.mapper;

import edu.tamu.wumrwds.database.entity.Person;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PersonMapper {
    List<Person> findAll();
}
