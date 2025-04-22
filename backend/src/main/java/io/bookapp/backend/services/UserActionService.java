package io.bookapp.backend.services;

import io.bookapp.backend.dto.ReadingListDto;
import io.bookapp.backend.entities.ReadingList;
import io.bookapp.backend.entities.User;
import io.bookapp.backend.exceptions.AppException;
import io.bookapp.backend.mappers.ReadingListMapper;
import io.bookapp.backend.mappers.UserMapper;
import io.bookapp.backend.repositories.ReadingListRepository;
import io.bookapp.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;


@RequiredArgsConstructor
@Service
public class UserActionService {

    private final UserRepository userRepository;
    private final ReadingListRepository readingListRepository;
    private final ReadingListMapper readingListMapper;

    public boolean addBookToFavorites(Long userId, String bookId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            user.get().getFavorites().add(bookId);
            userRepository.save(user.get());
            return true;
        }
        return false;
    }

    public boolean removeBookFromFavorites(Long userId, String bookId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Set<String> favorites = user.get().getFavorites();
            if (favorites != null && favorites.contains(bookId)) {
                favorites.remove(bookId);
                userRepository.save(user.get()); // Save the updated user
                return true;
            }
        }
        return false;
    }

    public Set<String> getFavoriteBooks(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get().getFavorites() != null ? user.get().getFavorites() : Collections.emptySet();
        }
        return Collections.emptySet();
    }

    public boolean addBookToReadingList(Long userId, String readingListName, String bookId) {
        Optional<ReadingList> readingListOptional = readingListRepository.findByName(readingListName);
        if (readingListOptional.isEmpty()) return false;
        ReadingList list = readingListOptional.get();
        if (list.getUser() == null || !list.getUser().getId().equals(userId) || list.getBooks().contains(bookId)) {
            return false;
        }
        list.getBooks().add(bookId);
        readingListRepository.save(list);
        return true;
    }

    public boolean removeBookFromReadingList(Long userId, String readingListName, String bookId) {
        Optional<ReadingList> readingList = readingListRepository.findByName(readingListName);
        if (readingList.isPresent()) {
            ReadingList list = readingList.get();
            if (list.getUser().getId().equals(userId)) {
                boolean removed = list.getBooks().removeIf(id -> id.equals(bookId));
                if (removed) {
                    readingListRepository.save(list);
                    return true;
                }
            }
        }
        return false;
    }

    public List<ReadingListDto> getReadingListsByUser(Long userId) {
        List<ReadingList> readingLists = readingListRepository.findByUserId(userId);
        return readingListMapper.toReadingListDtos(readingLists);
    }

    @Transactional // as I rely on cascading and orphan removal
    public boolean removeReadingList(Long userId, String readingListName) {
        Optional<User> userOptional= userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getReadingLists().removeIf(rl -> rl.getName().equalsIgnoreCase(readingListName));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public ReadingListDto createReadingList(Long userId, ReadingListDto readingListDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User with ID " + userId + " not found.");
        }
        User user = userOptional.get();

        ReadingList readingList = new ReadingList();
        readingList.setName(readingListDto.getName());
        readingList.setUser(user); // owning side
        user.getReadingLists().add(readingList); // inverse side

        System.out.println(readingList);
        // Save the user (parent entity; cascade will persist readingList)
        userRepository.save(user);
        return readingListMapper.toReadingListDto(readingList);
    }
}
