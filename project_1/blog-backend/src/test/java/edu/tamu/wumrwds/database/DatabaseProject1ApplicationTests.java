package edu.tamu.wumrwds.database;

import edu.tamu.wumrwds.database.entity.Person;
import edu.tamu.wumrwds.database.service.PersonService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
class DatabaseProject1ApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PersonService personService;


    @Test
	void testFindAllPerson() throws Exception {

        List<Person> persons = personService.findAll();

        mockMvc.perform(MockMvcRequestBuilders.get("/person/findAll")
                .accept("application/json"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.*", hasSize(persons.size())));
	}

}
