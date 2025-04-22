package io.bookapp.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reading_lists")
@Getter
@Setter
@EqualsAndHashCode(exclude = "user")
@ToString(exclude = "user")
public class ReadingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // owning side; holds foreign key
    @ManyToOne
    private User user;

    @ElementCollection(fetch = FetchType.EAGER) // tells JPA: collection of a basic type; load this collection every time the parent entity is loaded
    @CollectionTable(name = "reading_list_books", joinColumns = @JoinColumn(name = "reading_list_id"))
    @Column(name = "book_id")
    private List<String> books =  new ArrayList<>();
}
