package io.bookapp.backend.controllers;

import io.bookapp.backend.dto.ReadingListDto;
import io.bookapp.backend.entities.ReadingList;
import io.bookapp.backend.services.UserActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;


@RequiredArgsConstructor
@RestController
@RequestMapping("api/users")
public class UserActionController {

    private final UserActionService userActionService;

    @PostMapping("/{userId}/favorites/{bookId}")
    public ResponseEntity<String> addBookToFavorites(@PathVariable Long userId, @PathVariable String bookId) {
        boolean isAdded = userActionService.addBookToFavorites(userId, bookId);
        if (isAdded) {
            return ResponseEntity.ok("Book added to favorites.");
        } else {
            return ResponseEntity.badRequest().body("Failed to add book to favorites.");
        }
    }

    @DeleteMapping("/{userId}/favorites/{bookId}")
    public ResponseEntity<String> removeBookFromFavorites(@PathVariable Long userId, @PathVariable String bookId) {
        boolean isRemoved = userActionService.removeBookFromFavorites(userId, bookId);
        if (isRemoved) {
            return ResponseEntity.ok("Book removed from favorites.");
        } else {
            return ResponseEntity.badRequest().body("Failed to remove book from favorites.");
        }
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<Set<String>> getFavoriteBooks(@PathVariable Long userId) {
        Set<String> favoriteBooks = userActionService.getFavoriteBooks(userId);
        if (favoriteBooks.isEmpty()) {
            return ResponseEntity.ok(Collections.emptySet());
        }
        return ResponseEntity.ok(favoriteBooks);
    }

    @PostMapping("/{userId}/reading-lists")
    public ResponseEntity<ReadingListDto> createReadingList(@PathVariable Long userId, @RequestBody ReadingListDto readingList) {
        ReadingListDto createdReadingList = userActionService.createReadingList(userId, readingList);
        return ResponseEntity.ok(createdReadingList);
    }

    @PostMapping("/{userId}/reading-lists/{readingListName}/books/{bookId}")
    public ResponseEntity<String> addBookToReadingList(@PathVariable Long userId, @PathVariable String readingListName, @PathVariable String bookId) {
        boolean isAdded = userActionService.addBookToReadingList(userId, readingListName, bookId);
        if (isAdded) {
            return ResponseEntity.ok("Book added to reading list.");
        } else {
            return ResponseEntity.badRequest().body("Failed to add book to reading list.");
        }
    }

    @DeleteMapping("/{userId}/reading-lists/{readingListName}/books/{bookId}")
    public ResponseEntity<String> removeBookToReadingList(@PathVariable Long userId, @PathVariable String readingListName, @PathVariable String bookId) {
        boolean isRemoved = userActionService.removeBookFromReadingList(userId, readingListName, bookId);
        if (isRemoved) {
            return ResponseEntity.ok("Book removed from reading list.");
        } else {
            return ResponseEntity.badRequest().body("Failed to remove book from reading list.");
        }
    }

    @GetMapping("/{userId}/reading-lists")
    public ResponseEntity<List<ReadingListDto>> getReadingLists(@PathVariable Long userId) {
        List<ReadingListDto> readingLists = userActionService.getReadingListsByUser(userId);
        return ResponseEntity.ok(readingLists);
    }

    @DeleteMapping("/{userId}/reading-lists/{readingListName}")
    public ResponseEntity<String> removeReadingList(@PathVariable Long userId, @PathVariable String readingListName) {
        boolean isRemoved = userActionService.removeReadingList(userId, readingListName);
        if (isRemoved) {
            return ResponseEntity.ok("Removed reading list.");
        } else {
            return ResponseEntity.badRequest().body("Failed to remove reading list.");
        }
    }

}
