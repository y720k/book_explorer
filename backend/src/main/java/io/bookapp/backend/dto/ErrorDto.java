package io.bookapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder // adds builder pattern
@Data // adds getters/setters/...
public class ErrorDto {

    private String message;

}
