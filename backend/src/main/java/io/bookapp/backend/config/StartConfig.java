package io.bookapp.backend.config;

import io.bookapp.backend.entities.ReadingList;
import io.bookapp.backend.entities.User;
import io.bookapp.backend.mappers.UserMapper;
import io.bookapp.backend.repositories.ReadingListRepository;
import io.bookapp.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class StartConfig {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ReadingListRepository readingListRepository;

    @Bean
    CommandLineRunner UserCommandLineRunner(UserRepository repository) {
        // functional interface used to run code after the application starts
        // allows to execute logic right after the Spring context is fully initialized.

        return args -> {
            User user = new User();
            user.setFirstName("test");
            user.setLastName("user");
            user.setLogin("test@test.de");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setFavorites(new HashSet<>(Set.of("OL19809141W", "OL21221785W")));

            ReadingList readingList = new ReadingList();
            readingList.setName("test");
            readingList.setBooks(new ArrayList<>(
                    List.of("OL893415W", "OL17618370W", "OL49488W", "OL18417W", "OL796465W", "OL1673205W")
            )); // "Dune", "Clean Code", ...

            // link both sides of the relationship
            readingList.setUser(user);
            user.setReadingLists(new HashSet<>(Set.of(readingList)));

            userRepository.save(user); // only save user — cascade saves reading list
        };
    }

}
