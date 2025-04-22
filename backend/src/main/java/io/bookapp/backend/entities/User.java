package io.bookapp.backend.entities;


import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

// TODO: maybe create UserPrincipal which implements UserDetails
// TODO: (especially when security setup is extended by authorities/roles logic)
// TODO: keeps security logic out of the entity and DTO

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "app_user")
@Getter
@Setter
@EqualsAndHashCode(exclude = "readingLists") // prevent recursive calls established through bi-directional relationship
@ToString(exclude = "readingLists") // same here
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "book_id")
    private Set<String> favorites =  new HashSet<>();

    // 1. cascade save/delete operations on the user to their reading lists
    // 2. if a reading list is removed from the users collection and it's
    // no longer referenced by any other parent, JPA will delete it from the database automatically
    // --> inverse side of the relationship; refers to key in ReadingList
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ReadingList> readingLists;

}


