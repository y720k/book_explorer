package io.bookapp.backend.repositories;

import io.bookapp.backend.entities.ReadingList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReadingListRepository extends JpaRepository<ReadingList, Long> {

    List<ReadingList> findByUserId(Long userId);
    Optional<ReadingList> findByName(String name);
}

