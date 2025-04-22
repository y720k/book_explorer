package io.bookapp.backend.mappers;


import io.bookapp.backend.dto.SignUpDto;
import io.bookapp.backend.dto.UserDto;
import io.bookapp.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    // don't map password field
    @Mapping(target="password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);
}
