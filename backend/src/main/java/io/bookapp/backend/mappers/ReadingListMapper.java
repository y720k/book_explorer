package io.bookapp.backend.mappers;


import io.bookapp.backend.dto.ReadingListDto;
import io.bookapp.backend.dto.SignUpDto;
import io.bookapp.backend.dto.UserDto;
import io.bookapp.backend.entities.ReadingList;
import io.bookapp.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")
public interface ReadingListMapper {

    @Mapping(source = "user.id", target = "userId")  // Mapping user id from User entity to userId in DTO
    ReadingListDto toReadingListDto(ReadingList readingList);

    @Mapping(source = "userId", target = "user.id")
    ReadingList toReadingList(ReadingListDto readingListDto);

    List<ReadingListDto> toReadingListDtos(List<ReadingList> readingLists);
}
